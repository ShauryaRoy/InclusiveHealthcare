import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  phone: { type: String, default: null },
  languagePreference: { type: String, default: null },
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
}, { timestamps: true });

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  languagePreference: { type: String, default: null },
  accommodationNeeds: { type: String, default: null },
  communicationPreference: { type: String, default: null },
  paymentIntentId: { type: String, default: null },
  amount: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: null },
  message: { type: String, required: true },
  preferredLanguage: { type: String, default: null },
  status: { type: String, default: 'new' },
}, { timestamps: true });

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, default: null },
  price: { type: String, default: null },
  available: { type: Boolean, default: true },
});

// Medicine Schema
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  prescription: { type: Boolean, default: false },
  brand: { type: String, required: true },
  dosage: { type: String, required: true },
  rating: { type: String, default: "0" },
  reviews: { type: Number, default: 0 },
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: null },
  shippingAddress: { type: String, required: true },
  total: { type: String, required: true },
  status: { type: String, default: 'pending' },
  paymentIntentId: { type: String, default: null },
  trackingNumber: { type: String, default: null },
  estimatedDelivery: { type: String, default: null },
}, { timestamps: true });

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  price: { type: String, required: true },
  medicineName: { type: String, required: true },
}, { timestamps: true });

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorPhone: { type: String, required: true },
  medications: [{
    name: String,
    dosage: String,
    quantity: Number,
    instructions: String
  }],
  status: { type: String, default: 'pending' }, // pending, verified, fulfilled
  notes: { type: String, default: null },
}, { timestamps: true });

// Consultation Schema
const consultationSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  consultationType: { type: String, required: true }, // medication-review, drug-interaction, side-effects
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  questions: { type: String, required: true },
  status: { type: String, default: 'scheduled' }, // scheduled, completed, cancelled
  pharmacistNotes: { type: String, default: null },
}, { timestamps: true });

// Models
export const User = mongoose.model('User', userSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export const Service = mongoose.model('Service', serviceSchema);
export const Medicine = mongoose.model('Medicine', medicineSchema);
export const Order = mongoose.model('Order', orderSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export const Prescription = mongoose.model('Prescription', prescriptionSchema);
export const Consultation = mongoose.model('Consultation', consultationSchema);

// Connect to MongoDB
export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-plus';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}