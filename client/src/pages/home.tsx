import Navigation from "@/components/navigation";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import StaffSection from "@/components/staff-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AccessibilityToolbar />
      <Navigation />
      
      <main id="main-content" role="main">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <StaffSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
