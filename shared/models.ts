import mongoose from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  languagePreference: { type: String, default: 'english' },
  createdAt: { type: Date, default: Date.now },
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  languagePreference: { type: String, default: 'english' },
  accommodationNeeds: { type: String },
  additionalNotes: { type: String },
  status: { type: String, default: 'scheduled' },
  paymentIntentId: { type: String },
  amount: { type: String, default: '75.00' },
  createdAt: { type: Date, default: Date.now },
});

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  preferredLanguage: { type: String, default: 'english' },
  status: { type: String, default: 'unread' },
  createdAt: { type: Date, default: Date.now },
});

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String },
  duration: { type: Number }, // in minutes
  available: { type: Boolean, default: true },
});

// Create Models
export const User = mongoose.model('User', userSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export const Service = mongoose.model('Service', serviceSchema);

// Zod Schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  languagePreference: z.string().default('english'),
});

export const insertAppointmentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
  languagePreference: z.string().default("english"),
  accommodationNeeds: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const insertContactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferredLanguage: z.string().default("english"),
});

export const insertServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.string().optional(),
  duration: z.number().optional(),
  available: z.boolean().default(true),
});

// TypeScript types
export type UserType = z.infer<typeof insertUserSchema> & { _id?: string; createdAt?: Date };
export type AppointmentType = z.infer<typeof insertAppointmentSchema> & { 
  _id?: string; 
  status?: string; 
  paymentIntentId?: string; 
  amount?: string; 
  createdAt?: Date 
};
export type ContactMessageType = z.infer<typeof insertContactMessageSchema> & { 
  _id?: string; 
  status?: string; 
  createdAt?: Date 
};
export type ServiceType = z.infer<typeof insertServiceSchema> & { _id?: string };