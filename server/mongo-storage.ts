import { 
  User, 
  Appointment, 
  ContactMessage, 
  Service, 
  Medicine, 
  Order, 
  OrderItem,
  Prescription,
  Consultation 
} from './mongodb';
import type { IStorage } from './storage';
import type { 
  User as UserType, 
  InsertUser, 
  Appointment as AppointmentType, 
  InsertAppointment,
  ContactMessage as ContactMessageType,
  InsertContactMessage,
  Service as ServiceType,
  InsertService,
  Medicine as MedicineType,
  InsertMedicine,
  Order as OrderType,
  InsertOrder,
  OrderItem as OrderItemType,
  InsertOrderItem
} from '../shared/schema';

export class MongoStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Initialize default services if they don't exist
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await this.initializeServices();
    }

    // Initialize sample medicines if they don't exist
    const medicineCount = await Medicine.countDocuments();
    if (medicineCount === 0) {
      await this.initializeMedicines();
    }
  }

  private async initializeServices() {
    const defaultServices = [
      {
        name: "General Medicine",
        category: "primary-care",
        description: "Comprehensive primary care services including routine check-ups, preventive care, and treatment of common illnesses.",
        duration: 45,
        price: "75.00",
        available: true,
      },
      {
        name: "Cardiology Consultation",
        category: "specialty",
        description: "Specialized cardiac care including heart health assessments, ECG, and cardiovascular disease management.",
        duration: 60,
        price: "150.00",
        available: true,
      },
      {
        name: "Mental Health Counseling",
        category: "mental-health",
        description: "Professional mental health support including therapy sessions, stress management, and emotional wellness.",
        duration: 90,
        price: "120.00",
        available: true,
      },
      {
        name: "Pediatric Care",
        category: "pediatrics",
        description: "Specialized healthcare for children including wellness checks, vaccinations, and developmental assessments.",
        duration: 30,
        price: "85.00",
        available: true,
      },
    ];

    await Service.insertMany(defaultServices);
  }

  private async initializeMedicines() {
    const defaultMedicines = [
      {
        name: "Acetaminophen 500mg",
        category: "pain-relief",
        description: "Pain reliever and fever reducer. Non-prescription pain medication for headaches, muscle aches, and arthritis.",
        price: "12.99",
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
        category: "cardiovascular",
        description: "ACE inhibitor for high blood pressure and heart failure. Requires prescription from healthcare provider.",
        price: "24.99",
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
        category: "diabetes",
        description: "Diabetes medication to control blood sugar levels. Extended-release formula for better compliance.",
        price: "18.50",
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
        category: "vitamins",
        description: "Bone health supplement. Supports immune system and calcium absorption for strong bones.",
        price: "15.99",
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
        category: "antibiotics",
        description: "Antibiotic for bacterial infections. Treats respiratory, urinary tract, and skin infections.",
        price: "32.00",
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
        category: "vitamins",
        description: "Heart health supplement with EPA and DHA. Supports cardiovascular and brain health.",
        price: "22.99",
        inStock: true,
        stockCount: 180,
        prescription: false,
        brand: "Nordic Naturals",
        dosage: "1000mg softgels",
        rating: "4.8",
        reviews: 523
      }
    ];

    await Medicine.insertMany(defaultMedicines);
  }

  // User operations
  async getUser(id: number): Promise<UserType | undefined> {
    const user = await User.findById(id).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    const user = await User.findOne({ username }).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    const user = await User.findOne({ email }).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const user = await User.create(insertUser);
    return this.transformUser(user.toObject());
  }

  // Appointment operations
  async getAppointment(id: number): Promise<AppointmentType | undefined> {
    const appointment = await Appointment.findById(id).lean();
    return appointment ? this.transformAppointment(appointment) : undefined;
  }

  async getAppointmentsByEmail(email: string): Promise<AppointmentType[]> {
    const appointments = await Appointment.find({ email }).lean();
    return appointments.map(this.transformAppointment);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<AppointmentType> {
    const appointment = await Appointment.create(insertAppointment);
    return this.transformAppointment(appointment.toObject());
  }

  async updateAppointmentPayment(id: number, paymentIntentId: string): Promise<AppointmentType | undefined> {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentIntentId, status: 'confirmed' },
      { new: true }
    ).lean();
    return appointment ? this.transformAppointment(appointment) : undefined;
  }

  // Contact message operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessageType> {
    const message = await ContactMessage.create(insertMessage);
    return this.transformContactMessage(message.toObject());
  }

  async getContactMessages(): Promise<ContactMessageType[]> {
    const messages = await ContactMessage.find().lean();
    return messages.map(this.transformContactMessage);
  }

  // Service operations
  async getServices(): Promise<ServiceType[]> {
    const services = await Service.find().lean();
    return services.map(this.transformService);
  }

  async getService(id: number): Promise<ServiceType | undefined> {
    const service = await Service.findById(id).lean();
    return service ? this.transformService(service) : undefined;
  }

  async createService(insertService: InsertService): Promise<ServiceType> {
    const service = await Service.create(insertService);
    return this.transformService(service.toObject());
  }

  // Medicine operations
  async getMedicines(): Promise<MedicineType[]> {
    const medicines = await Medicine.find().lean();
    return medicines.map(this.transformMedicine);
  }

  async getMedicine(id: number): Promise<MedicineType | undefined> {
    const medicine = await Medicine.findById(id).lean();
    return medicine ? this.transformMedicine(medicine) : undefined;
  }

  async getMedicinesByCategory(category: string): Promise<MedicineType[]> {
    const medicines = await Medicine.find({ category }).lean();
    return medicines.map(this.transformMedicine);
  }

  async searchMedicines(searchTerm: string): Promise<MedicineType[]> {
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }).lean();
    return medicines.map(this.transformMedicine);
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<MedicineType> {
    const medicine = await Medicine.create(insertMedicine);
    return this.transformMedicine(medicine.toObject());
  }

  async updateMedicineStock(id: number, stockCount: number): Promise<MedicineType | undefined> {
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { stockCount, inStock: stockCount > 0 },
      { new: true }
    ).lean();
    return medicine ? this.transformMedicine(medicine) : undefined;
  }

  // Order operations
  async getOrder(id: number): Promise<OrderType | undefined> {
    const order = await Order.findById(id).lean();
    return order ? this.transformOrder(order) : undefined;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderType | undefined> {
    const order = await Order.findOne({ orderNumber }).lean();
    return order ? this.transformOrder(order) : undefined;
  }

  async getOrdersByEmail(email: string): Promise<OrderType[]> {
    const orders = await Order.find({ customerEmail: email }).lean();
    return orders.map(this.transformOrder);
  }

  async createOrder(insertOrder: InsertOrder): Promise<OrderType> {
    const order = await Order.create(insertOrder);
    return this.transformOrder(order.toObject());
  }

  async updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<OrderType | undefined> {
    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return order ? this.transformOrder(order) : undefined;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItemType[]> {
    const items = await OrderItem.find({ orderId }).lean();
    return items.map(this.transformOrderItem);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItemType> {
    const item = await OrderItem.create(insertOrderItem);
    return this.transformOrderItem(item.toObject());
  }

  // Prescription operations
  async createPrescription(data: any) {
    return await Prescription.create(data);
  }

  async getPrescriptionsByEmail(email: string) {
    return await Prescription.find({ patientEmail: email }).lean();
  }

  async updatePrescriptionStatus(id: string, status: string, notes?: string) {
    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    return await Prescription.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  // Consultation operations
  async createConsultation(data: any) {
    return await Consultation.create(data);
  }

  async getConsultationsByEmail(email: string) {
    return await Consultation.find({ patientEmail: email }).lean();
  }

  async updateConsultationStatus(id: string, status: string, notes?: string) {
    const updateData: any = { status };
    if (notes) updateData.pharmacistNotes = notes;
    return await Consultation.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  // Transform functions to match expected types
  private transformUser(user: any): UserType {
    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      languagePreference: user.languagePreference,
      createdAt: user.createdAt
    };
  }

  private transformAppointment(appointment: any): AppointmentType {
    return {
      id: appointment._id.toString(),
      email: appointment.email,
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      phone: appointment.phone,
      service: appointment.service,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      languagePreference: appointment.languagePreference,
      accommodationNeeds: appointment.accommodationNeeds,
      communicationPreference: appointment.communicationPreference,
      paymentIntentId: appointment.paymentIntentId,
      amount: appointment.amount,
      status: appointment.status,
      createdAt: appointment.createdAt
    };
  }

  private transformContactMessage(message: any): ContactMessageType {
    return {
      id: message._id.toString(),
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      preferredLanguage: message.preferredLanguage,
      status: message.status,
      createdAt: message.createdAt
    };
  }

  private transformService(service: any): ServiceType {
    return {
      id: service._id.toString(),
      name: service.name,
      category: service.category,
      description: service.description,
      duration: service.duration,
      price: service.price,
      available: service.available
    };
  }

  private transformMedicine(medicine: any): MedicineType {
    return {
      id: medicine._id.toString(),
      name: medicine.name,
      category: medicine.category,
      description: medicine.description,
      price: medicine.price,
      inStock: medicine.inStock,
      stockCount: medicine.stockCount,
      prescription: medicine.prescription,
      brand: medicine.brand,
      dosage: medicine.dosage,
      rating: medicine.rating,
      reviews: medicine.reviews,
      createdAt: medicine.createdAt
    };
  }

  private transformOrder(order: any): OrderType {
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      total: order.total,
      status: order.status,
      paymentIntentId: order.paymentIntentId,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  private transformOrderItem(item: any): OrderItemType {
    return {
      id: item._id.toString(),
      orderId: item.orderId,
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: item.price,
      medicineName: item.medicineName,
      createdAt: item.createdAt
    };
  }
}