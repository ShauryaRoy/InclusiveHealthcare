import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ExternalLink, Phone, Heart, Brain, Baby, Zap, Stethoscope, Activity } from "lucide-react";

const serviceIcons = {
  "Emergency": Zap,
  "Primary Care": Stethoscope,
  "Specialty": Heart,
  "Mental Health": Brain,
  "Therapy": Activity,
};

const serviceImages = [
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
];

export default function ServicesSection() {
  const { data: services, isLoading, error } = useQuery({
    queryKey: ["/api/services"],
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gray-50" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-20 bg-gray-50" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Unable to load services. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Medical Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered with cultural competency and accessibility in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service: any, index: number) => {
            const IconComponent = serviceIcons[service.category as keyof typeof serviceIcons] || Heart;
            const imageIndex = index % serviceImages.length;
            
            return (
              <Card key={service.id} className="service-card group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={serviceImages[imageIndex]}
                    alt={`${service.name} - ${service.description}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{service.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">{service.category}</span>
                    {service.price && (
                      <span className="text-lg font-bold text-blue-600">
                        ${parseFloat(service.price).toFixed(0)}
                      </span>
                    )}
                  </div>
                  {service.duration && (
                    <p className="text-sm text-gray-500 mb-4">
                      Duration: {service.duration} minutes
                    </p>
                  )}
                  <Button asChild className="w-full">
                    <Link href="/appointments">
                      Book Appointment
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Need emergency care or have questions about our services?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="destructive" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Emergency: 911
            </Button>
            <Button variant="outline" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Main Line: (555) 123-4567
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
