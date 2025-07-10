import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertAppointmentSchema, insertContactMessageSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Pharmacy API endpoints
  
  // Get all medicines
  app.get("/api/medicines", async (req, res) => {
    try {
      const { category, search } = req.query;
      let medicines;
      
      if (search) {
        medicines = await storage.searchMedicines(search as string);
      } else if (category && category !== "all") {
        medicines = await storage.getMedicinesByCategory(category as string);
      } else {
        medicines = await storage.getMedicines();
      }
      
      res.json(medicines);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching medicines: " + error.message });
    }
  });

  // Get single medicine
  app.get("/api/medicines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const medicine = await storage.getMedicine(parseInt(id));
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json(medicine);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching medicine: " + error.message });
    }
  });

  // Create pharmacy order and payment intent
  app.post("/api/pharmacy/create-order", async (req, res) => {
    try {
      const { items, customerInfo, shippingAddress } = req.body;
      
      if (!items || !items.length) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }

      // Calculate total
      let total = 0;
      for (const item of items) {
        const medicine = await storage.getMedicine(item.medicineId);
        if (!medicine) {
          return res.status(400).json({ message: `Medicine with ID ${item.medicineId} not found` });
        }
        if (!medicine.inStock || medicine.stockCount < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
        }
        total += parseFloat(medicine.price) * item.quantity;
      }

      // Generate order number
      const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        description: `Pharmacy Order ${orderNumber}`,
        metadata: {
          orderNumber,
          customerEmail: customerInfo.email,
        },
      });

      // Create order
      const order = await storage.createOrder({
        orderNumber,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || null,
        shippingAddress,
        total: total.toFixed(2),
        status: "pending",
        paymentIntentId: paymentIntent.id,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 3 days from now
      });

      // Create order items
      for (const item of items) {
        const medicine = await storage.getMedicine(item.medicineId);
        await storage.createOrderItem({
          orderId: order.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: medicine!.price,
        });
      }

      res.json({
        order,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating order: " + error.message });
    }
  });

  // Confirm pharmacy payment and update order
  app.post("/api/pharmacy/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, orderNumber } = req.body;
      
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === "succeeded") {
        const order = await storage.getOrderByNumber(orderNumber);
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        // Update order status and generate tracking number
        const trackingNumber = `TRK${Date.now().toString().slice(-9)}`;
        await storage.updateOrderStatus(order.id, "confirmed", trackingNumber);

        // Update medicine stock
        const orderItems = await storage.getOrderItems(order.id);
        for (const item of orderItems) {
          const medicine = await storage.getMedicine(item.medicineId);
          if (medicine) {
            await storage.updateMedicineStock(medicine.id, medicine.stockCount - item.quantity);
          }
        }

        res.json({ 
          success: true, 
          message: "Payment confirmed successfully",
          trackingNumber 
        });
      } else {
        res.status(400).json({ message: "Payment not successful" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Get user orders
  app.get("/api/orders/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const orders = await storage.getOrdersByEmail(email);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          const itemsWithMedicines = await Promise.all(
            items.map(async (item) => {
              const medicine = await storage.getMedicine(item.medicineId);
              return { ...item, medicine };
            })
          );
          return { ...order, items: itemsWithMedicines };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching orders: " + error.message });
    }
  });

  // Track order
  app.get("/api/track/:orderNumber", async (req, res) => {
    try {
      const { orderNumber } = req.params;
      const order = await storage.getOrderByNumber(orderNumber);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error tracking order: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
