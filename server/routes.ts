import dotenv from 'dotenv';
dotenv.config();

import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertAppointmentSchema, insertContactMessageSchema } from "@shared/models";
import { z } from "zod";
import { connectToDatabase } from "./database";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  await connectToDatabase();

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching services: " + error.message });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating appointment: " + error.message });
      }
    }
  });

  // Get appointments by email
  app.get("/api/appointments/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const appointments = await storage.getAppointmentsByEmail(email);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching appointments: " + error.message });
    }
  });

  // Create payment intent for appointments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount = 7500, appointmentId, donationAmount, purpose = "appointment" } = req.body;

      const paymentAmount = donationAmount ? Math.round(donationAmount * 100) : amount;
      const description = purpose === "donation"
        ? "Donation to HealthCare Plus - Supporting inclusive healthcare"
        : "HealthCare Plus Appointment Fee";

      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentAmount,
        currency: "usd",
        description,
        metadata: {
          appointmentId: appointmentId?.toString() || "",
          purpose,
        },
      });

      // If appointmentId is provided, update the appointment with payment intent ID
      if (appointmentId) {
        await storage.updateAppointmentPayment(appointmentId, paymentIntent.id);
      }

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Confirm payment and update appointment
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, appointmentId } = req.body;

      // Retrieve payment intent from Stripe to verify it was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        // Update appointment with payment confirmation
        if (appointmentId) {
          await storage.updateAppointmentPayment(appointmentId, paymentIntentId);
        }
        res.json({ success: true, message: "Payment confirmed successfully" });
      } else {
        res.status(400).json({ message: "Payment not successful" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Create donation payment intent
  app.post("/api/create-donation-intent", async (req, res) => {
    try {
      const { amount, program } = req.body;

      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid donation amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        description: `Donation to HealthCare Plus${program ? ` - ${program}` : ""}`,
        metadata: {
          purpose: "donation",
          program: program || "general",
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating donation intent: " + error.message });
    }
  });

  // Create contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating contact message: " + error.message });
      }
    }
  });

  // Get contact messages (admin endpoint)
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching contact messages: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}