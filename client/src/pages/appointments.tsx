import Navigation from "@/components/navigation";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import AppointmentForm from "@/components/appointment-form";
import Footer from "@/components/footer";

export default function Appointments() {
  return (
    <div className="min-h-screen">
      <AccessibilityToolbar />
      <Navigation />
      
      <main id="main-content" role="main" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Book Your Appointment
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schedule your visit with our diverse team of healthcare professionals. 
              We accept all insurance plans and offer sliding scale fees based on income.
            </p>
          </div>
          
          <AppointmentForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
