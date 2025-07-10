import { 
  users, appointments, contactMessages, services, medicines, orders, orderItems,
  type User, type InsertUser, type Appointment, type InsertAppointment,
  type ContactMessage, type InsertContactMessage, type Service, type InsertService,
  type Medicine, type InsertMedicine, type Order, type InsertOrder, type OrderItem, type InsertOrderItem
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

  // Medicine operations
  getMedicines(): Promise<Medicine[]>;
  getMedicine(id: number): Promise<Medicine | undefined>;
  getMedicinesByCategory(category: string): Promise<Medicine[]>;
  searchMedicines(searchTerm: string): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicineStock(id: number, stockCount: number): Promise<Medicine | undefined>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<Order | undefined>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private contactMessages: Map<number, ContactMessage>;
  private services: Map<number, Service>;
  private medicines: Map<number, Medicine>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentUserId: number;
  private currentAppointmentId: number;
  private currentContactMessageId: number;
  private currentServiceId: number;
  private currentMedicineId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.contactMessages = new Map();
    this.services = new Map();
    this.medicines = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentUserId = 1;
    this.currentAppointmentId = 1;
    this.currentContactMessageId = 1;
    this.currentServiceId = 1;
    this.currentMedicineId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    // Initialize default data
    this.initializeServices();
    this.initializeMedicines();
    this.initializeDummyOrder();
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

  private initializeMedicines() {
    const defaultMedicines: Omit<Medicine, 'id' | 'createdAt'>[] = [
      {
        name: "Acetaminophen 500mg",
        description: "Pain reliever and fever reducer. Non-prescription pain medication for headaches, muscle aches, and arthritis.",
        price: "12.99",
        category: "pain-relief",
        inStock: true,
        stockCount: 150,
        prescription: false,
        brand: "Generic",
        dosage: "500mg tablets",
        rating: "4.5",
        reviews: 324
      },
      {
        name: "Lisinopril 10mg",
        description: "ACE inhibitor for high blood pressure and heart failure. Requires prescription from healthcare provider.",
        price: "24.99",
        category: "cardiovascular",
        inStock: true,
        stockCount: 75,
        prescription: true,
        brand: "Prinivil",
        dosage: "10mg tablets",
        rating: "4.2",
        reviews: 186
      },
      {
        name: "Metformin 500mg",
        description: "Diabetes medication to control blood sugar levels. Extended-release formula for better compliance.",
        price: "18.50",
        category: "diabetes",
        inStock: true,
        stockCount: 120,
        prescription: true,
        brand: "Glucophage",
        dosage: "500mg XR tablets",
        rating: "4.7",
        reviews: 298
      },
      {
        name: "Vitamin D3 2000 IU",
        description: "Bone health supplement. Supports immune system and calcium absorption for strong bones.",
        price: "15.99",
        category: "vitamins",
        inStock: true,
        stockCount: 200,
        prescription: false,
        brand: "Nature Made",
        dosage: "2000 IU softgels",
        rating: "4.6",
        reviews: 412
      },
      {
        name: "Amoxicillin 500mg",
        description: "Antibiotic for bacterial infections. Treats respiratory, urinary tract, and skin infections.",
        price: "32.00",
        category: "antibiotics",
        inStock: true,
        stockCount: 45,
        prescription: true,
        brand: "Amoxil",
        dosage: "500mg capsules",
        rating: "4.3",
        reviews: 156
      },
      {
        name: "Omega-3 Fish Oil",
        description: "Heart health supplement with EPA and DHA. Supports cardiovascular and brain health.",
        price: "22.99",
        category: "vitamins",
        inStock: true,
        stockCount: 180,
        prescription: false,
        brand: "Nordic Naturals",
        dosage: "1000mg softgels",
        rating: "4.8",
        reviews: 523
      }
    ];

    defaultMedicines.forEach(medicine => {
      const id = this.currentMedicineId++;
      const newMedicine: Medicine = {
        ...medicine,
        id,
        createdAt: new Date()
      };
      this.medicines.set(id, newMedicine);
    });
  }

  private initializeDummyOrder() {
    // Create dummy order that matches the frontend tracking page
    const orderId = this.currentOrderId++;
    const order: Order = {
      id: orderId,
      orderNumber: "ORD-2025-123456",
      customerEmail: "john.doe@example.com",
      customerName: "John Doe",
      customerPhone: "(555) 123-4567",
      shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
      total: "89.97",
      status: "confirmed",
      trackingNumber: null,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      paymentIntentId: "pi_dummy_payment_intent",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(orderId, order);

    // Create order items for the dummy order
    const medicines = [1, 4, 1]; // Acetaminophen, Vitamin D3, Acetaminophen (for Ibuprofen simulation)
    const quantities = [2, 1, 1];
    const prices = ["12.99", "15.99", "12.99"];

    medicines.forEach((medicineId, index) => {
      const itemId = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        id: itemId,
        orderId: orderId,
        medicineId: medicineId,
        quantity: quantities[index],
        price: prices[index],
        createdAt: new Date()
      };
      this.orderItems.set(itemId, orderItem);
    });
  }

  // Medicine operations
  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values()).filter(medicine => medicine.category === category);
  }

  async searchMedicines(searchTerm: string): Promise<Medicine[]> {
    const term = searchTerm.toLowerCase();
    return Array.from(this.medicines.values()).filter(medicine =>
      medicine.name.toLowerCase().includes(term) ||
      medicine.description.toLowerCase().includes(term) ||
      medicine.brand.toLowerCase().includes(term)
    );
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = this.currentMedicineId++;
    const medicine: Medicine = {
      ...insertMedicine,
      id,
      createdAt: new Date()
    };
    this.medicines.set(id, medicine);
    return medicine;
  }

  async updateMedicineStock(id: number, stockCount: number): Promise<Medicine | undefined> {
    const medicine = this.medicines.get(id);
    if (medicine) {
      const updated = { ...medicine, stockCount, inStock: stockCount > 0 };
      this.medicines.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerEmail === email);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updated = {
        ...order,
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        updatedAt: new Date()
      };
      this.orders.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = {
      ...insertOrderItem,
      id,
      createdAt: new Date()
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
}

export const storage = new MemStorage();
