import { connectToDatabase } from './database';
import { Service } from '@shared/models';

async function seedDatabase() {
  try {
    await connectToDatabase();
    
    // Clear existing services
    await Service.deleteMany({});
    
    // Insert default services
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
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();