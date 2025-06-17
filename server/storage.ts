import { 
  users, appointments, contactMessages, services,
  type User, type InsertUser, type Appointment, type InsertAppointment,
  type ContactMessage, type InsertContactMessage, type Service, type InsertService
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByEmail(email: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment | undefined>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private contactMessages: Map<number, ContactMessage>;
  private services: Map<number, Service>;
  private currentUserId: number;
  private currentAppointmentId: number;
  private currentContactMessageId: number;
  private currentServiceId: number;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.contactMessages = new Map();
    this.services = new Map();
    this.currentUserId = 1;
    this.currentAppointmentId = 1;
    this.currentContactMessageId = 1;
    this.currentServiceId = 1;

    // Initialize default services
    this.initializeServices();
  }

  private initializeServices() {
    const defaultServices: Omit<Service, 'id'>[] = [
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

    defaultServices.forEach(service => {
      const newService: Service = {
        ...service,
        id: this.currentServiceId++,
      };
      this.services.set(newService.id, newService);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByEmail(email: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => appointment.email === email);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "scheduled",
      paymentIntentId: null,
      amount: "75.00",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentPayment(id: number, paymentIntentId: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.paymentIntentId = paymentIntentId;
      this.appointments.set(id, appointment);
      return appointment;
    }
    return undefined;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      status: "unread",
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.available);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
}

export const storage = new MemStorage();
