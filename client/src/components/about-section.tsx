import { Users, Heart, Award, Shield } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Users,
      title: "Diverse Team",
      description: "Our medical professionals represent diverse backgrounds, cultures, and languages to better serve our community.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Shield,
      title: "Accessible Care",
      description: "We ensure our facilities and services are fully accessible to patients with all types of disabilities.",
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every patient receives personalized, culturally-sensitive care tailored to their unique needs.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const leadership = [
    {
      name: "Dr. Maria Rodriguez",
      role: "Chief of Medicine",
      languages: "Fluent in English and Spanish",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Dr. Maria Rodriguez, a professional Hispanic woman in medical attire smiling warmly",
    },
    {
      name: "Dr. James Kim",
      role: "Head of Cardiology",
      languages: "Speaks Korean and English",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Dr. James Kim, a professional Asian man in medical coat with stethoscope",
    },
    {
      name: "Dr. Aisha Patel",
      role: "Pediatrics Director",
      languages: "Fluent in Hindi and English",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400ages.unsplash.com/photo-1594824708194-8abfdfb0b4eb?ixlib=rb-4.0.3&auto=format&fit=https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&w=400&h=400",
      alt: "Dr. Aisha Patel, a professional South Asian woman in medical scrubs smiling confidently",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About HealthCare Plus
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded on principles of diversity, equity, and inclusion, we're committed to breaking down
            barriers to healthcare access and providing exceptional care to patients from all backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`${feature.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Leadership Team */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Meet Our Diverse Leadership Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="text-center">
                <img
                  src={leader.image}
                  alt={leader.alt}
                  className="rounded-full w-32 h-32 mx-auto mb-4 object-cover"
                />
                <h4 className="text-lg font-semibold text-gray-900">{leader.name}</h4>
                <p className="text-blue-600 font-medium">{leader.role}</p>
                <p className="text-sm text-gray-600 mt-2">{leader.languages}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
