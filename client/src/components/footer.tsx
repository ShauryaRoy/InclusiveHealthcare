import { Link } from "wouter";
import { Heart, Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin } from "lucide-react";

const handleScrollToSection = (href: string) => {
  if (href.startsWith("/#")) {
    const sectionId = href.substring(2);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About Us" },
    { href: "/#services", label: "Services" },
    { href: "/appointments", label: "Appointments" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/donate", label: "Donate" },
    { href: "/#contact", label: "Contact" },
  ];

  const services = [
    { href: "#services", label: "Emergency Care" },
    { href: "#services", label: "Cardiology" },
    { href: "#services", label: "Pediatrics" },
    { href: "#services", label: "Mental Health" },
    { href: "#services", label: "Rehabilitation" },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/non-discrimination", label: "Non-Discrimination" },
  ];

  const socialLinks = [
    { href: "#", label: "Facebook", icon: Facebook },
    { href: "#", label: "Twitter", icon: Twitter },
    { href: "#", label: "LinkedIn", icon: Linkedin },
    { href: "#", label: "Instagram", icon: Instagram },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">HealthCare Plus</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Inclusive healthcare for everyone. Breaking barriers, building bridges to better health 
              through compassionate, culturally-sensitive care.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/#") ? (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection(link.href);
                      }}
                      className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={`service-${index}`}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                <div>
                  <div>(555) 123-4567</div>
                  <div className="text-sm">Emergency: 911</div>
                </div>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>info@healthcareplus.com</span>
              </div>
              <div className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <div>123 Healthcare Boulevard</div>
                  <div>Medical District, MD 20901</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} HealthCare Plus. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Accessibility Statement */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong>Accessibility Commitment:</strong> HealthCare Plus is committed to ensuring 
              digital accessibility for people with disabilities. We are continually improving the 
              user experience for everyone and applying the relevant accessibility standards. 
              If you experience any difficulty accessing our website, please contact us at 
              accessibility@healthcareplus.com or (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
