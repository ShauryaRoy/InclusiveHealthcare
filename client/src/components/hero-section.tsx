import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-blue-50 to-teal-50 py-20"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Inclusive Healthcare for{" "}
              <span className="text-blue-600">Everyone</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              At HealthCare Plus, we believe quality healthcare should be accessible to all.
              Our diverse team of medical professionals is committed to providing compassionate,
              culturally-sensitive care in a welcoming environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/appointments">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">
                  <span>Our Services</span>
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Diverse group of healthcare professionals including doctors and nurses of different ethnicities working together in a modern hospital"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">HIPAA Compliant</p>
                  <p className="text-xs text-gray-600">Your privacy is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
