import { 
  User, Appointment, ContactMessage, Service,
  type UserType, type AppointmentType, type ContactMessageType, type ServiceType
} from "@shared/models";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<UserType | null>;
  getUserByUsername(username: string): Promise<UserType | null>;
  getUserByEmail(email: string): Promise<UserType | null>;
  createUser(user: Omit<UserType, '_id' | 'createdAt'>): Promise<UserType>;

  // Appointment operations
  getAppointment(id: string): Promise<AppointmentType | null>;
  getAppointmentsByEmail(email: string): Promise<AppointmentType[]>;
  createAppointment(appointment: Omit<AppointmentType, '_id' | 'status' | 'paymentIntentId' | 'amount' | 'createdAt'>): Promise<AppointmentType>;
  updateAppointmentPayment(id: string, paymentIntentId: string): Promise<AppointmentType | null>;
  
  // Contact message operations
  createContactMessage(message: Omit<ContactMessageType, '_id' | 'status' | 'createdAt'>): Promise<ContactMessageType>;
  getContactMessages(): Promise<ContactMessageType[]>;
  
  // Service operations
  getServices(): Promise<ServiceType[]>;
  getService(id: string): Promise<ServiceType | null>;
  createService(service: Omit<ServiceType, '_id'>): Promise<ServiceType>;
}

export class MongoStorage implements IStorage {
  constructor() {
    // Initialize default services if they don't exist
    this.initializeServices();
  }

  private async initializeServices() {
    try {
      const existingServices = await Service.countDocuments();
      if (existingServices === 0) {
        const defaultServices = [
          {
            name: "General Medicine",
            description: "Comprehensive primary care and preventive health services",
            category: "Primary Care",
            price: "150.00",
            duration: 30,
            available: true,
          },
          {
            name: "Emergency Care",
            description: "24/7 emergency medical services with multilingual staff",
            category: "Emergency",
            price: "500.00",
            duration: 60,
            available: true,
          },
          {
            name: "Cardiology",
            description: "Heart health diagnostics and treatment",
            category: "Specialty",
            price: "300.00",
            duration: 45,
            available: true,
          },
          {
            name: "Pediatrics",
            description: "Specialized care for children and adolescents",
            category: "Specialty",
            price: "200.00",
            duration: 30,
            available: true,
          },
          {
            name: "Mental Health",
            description: "Culturally-informed mental health services and counseling",
            category: "Mental Health",
            price: "250.00",
            duration: 60,
            available: true,
          },
          {
            name: "Rehabilitation",
            description: "Physical and occupational therapy services",
            category: "Therapy",
            price: "180.00",
            duration: 45,
            available: true,
          },
        ];

        await Service.insertMany(defaultServices);
        console.log('✅ Default services initialized');
      }
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  }

  async getUser(id: string): Promise<UserType | null> {
    try {
      return await User.findById(id).lean();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<UserType | null> {
    try {
      return await User.findOne({ username }).lean();
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<UserType | null> {
    try {
      return await User.findOne({ email }).lean();
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async createUser(userData: Omit<UserType, '_id' | 'createdAt'>): Promise<UserType> {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return savedUser.toObject();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAppointment(id: string): Promise<AppointmentType | null> {
    try {
      return await Appointment.findById(id).lean();
    } catch (error) {
      console.error('Error getting appointment:', error);
      return null;
    }
  }

  async getAppointmentsByEmail(email: string): Promise<AppointmentType[]> {
    try {
      return await Appointment.find({ email }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting appointments by email:', error);
      return [];
    }
  }

  async createAppointment(appointmentData: Omit<AppointmentType, '_id' | 'status' | 'paymentIntentId' | 'amount' | 'createdAt'>): Promise<AppointmentType> {
    try {
      const appointment = new Appointment({
        ...appointmentData,
        status: 'scheduled',
        amount: '75.00',
      });
      const savedAppointment = await appointment.save();
      return savedAppointment.toObject();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointmentPayment(id: string, paymentIntentId: string): Promise<AppointmentType | null> {
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { paymentIntentId },
        { new: true }
      ).lean();
      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment payment:', error);
      return null;
    }
  }

  async createContactMessage(messageData: Omit<ContactMessageType, '_id' | 'status' | 'createdAt'>): Promise<ContactMessageType> {
    try {
      const message = new ContactMessage({
        ...messageData,
        status: 'unread',
      });
      const savedMessage = await message.save();
      return savedMessage.toObject();
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  async getContactMessages(): Promise<ContactMessageType[]> {
    try {
      return await ContactMessage.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting contact messages:', error);
      return [];
    }
  }

  async getServices(): Promise<ServiceType[]> {
    try {
      return await Service.find({ available: true }).lean();
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }

  async getService(id: string): Promise<ServiceType | null> {
    try {
      return await Service.findById(id).lean();
    } catch (error) {
      console.error('Error getting service:', error);
      return null;
    }
  }

  async createService(serviceData: Omit<ServiceType, '_id'>): Promise<ServiceType> {
    try {
      const service = new Service(serviceData);
      const savedService = await service.save();
      return savedService.toObject();
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }
}

export const storage = new MongoStorage();