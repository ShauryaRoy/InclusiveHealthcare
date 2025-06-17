import Navigation from "@/components/navigation";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Heart, Award, Star } from "lucide-react";

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 1,
      title: "Multilingual Mental Health Program",
      category: "Mental Health",
      date: "2024",
      outcome: "85% improvement in patient satisfaction",
      description: "Implemented comprehensive mental health services with culturally-informed therapy in 8 languages, serving the diverse immigrant community.",
      metrics: [
        { label: "Patients Served", value: "2,400+", icon: Users },
        { label: "Languages Offered", value: "8", icon: Users },
        { label: "Satisfaction Rate", value: "95%", icon: TrendingUp },
      ],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      challenges: "Limited bilingual therapists, cultural stigma around mental health",
      solutions: "Recruited diverse staff, partnered with community leaders, created culturally-sensitive treatment protocols",
      impact: "Reduced mental health disparities by 40% in underserved communities",
    },
    {
      id: 2,
      title: "Accessible Emergency Care Initiative",
      category: "Emergency Medicine",
      date: "2023",
      outcome: "100% accessibility compliance achieved",
      description: "Redesigned emergency department to ensure full accessibility for patients with disabilities, including sensory impairments and mobility challenges.",
      metrics: [
        { label: "Accessibility Features", value: "25+", icon: Heart },
        { label: "Response Time", value: "3 min", icon: TrendingUp },
        { label: "Patient Rating", value: "4.9/5", icon: Star },
      ],
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      challenges: "Physical barriers, communication gaps, staff training needs",
      solutions: "Universal design principles, assistive technology, comprehensive staff training",
      impact: "Emergency care access improved for 15,000+ patients with disabilities",
    },
    {
      id: 3,
      title: "Community Health Outreach Program",
      category: "Community Health",
      date: "2023-2024",
      outcome: "60% increase in preventive care uptake",
      description: "Mobile health clinics serving underserved neighborhoods with preventive care, health education, and chronic disease management.",
      metrics: [
        { label: "Mobile Clinics", value: "12", icon: Heart },
        { label: "Communities Served", value: "35", icon: Users },
        { label: "Health Screenings", value: "8,500+", icon: TrendingUp },
      ],
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      challenges: "Geographic barriers, health insurance gaps, language barriers",
      solutions: "Mobile units with bilingual staff, sliding scale fees, community partnerships",
      impact: "Early detection of 1,200+ cases of hypertension and diabetes",
    },
    {
      id: 4,
      title: "Pediatric Specialty Care Access",
      category: "Pediatrics",
      date: "2023",
      outcome: "90% reduction in specialist wait times",
      description: "Expanded pediatric specialty services with telemedicine options to serve children in rural and underserved areas.",
      metrics: [
        { label: "Wait Time Reduction", value: "90%", icon: TrendingUp },
        { label: "Children Served", value: "3,200+", icon: Users },
        { label: "Specialties Available", value: "15", icon: Heart },
      ],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      challenges: "Specialist shortages, geographic distance, appointment availability",
      solutions: "Telemedicine expansion, specialist recruitment, flexible scheduling",
      impact: "Improved health outcomes for children in 50+ rural communities",
    },
  ];

  const stats = [
    { label: "Lives Impacted", value: "25,000+", icon: Users },
    { label: "Programs Launched", value: "12", icon: Award },
    { label: "Community Partners", value: "85", icon: Heart },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen">
      <AccessibilityToolbar />
      <Navigation />
      
      <main id="main-content" role="main" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories of impact: How we're breaking down healthcare barriers and 
              creating inclusive care experiences for our diverse community.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Studies */}
          <div className="space-y-12">
            {caseStudies.map((study) => (
              <Card key={study.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={study.image}
                      alt={`${study.title} - Healthcare case study showing diverse patients and staff`}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{study.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {study.date}
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{study.title}</h2>
                    <p className="text-gray-600 mb-6">{study.description}</p>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {study.metrics.map((metric, index) => (
                        <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                          <metric.icon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                          <div className="text-xs text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Challenge & Solutions */}
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Challenges</h4>
                        <p className="text-sm text-gray-600">{study.challenges}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solutions</h4>
                        <p className="text-sm text-gray-600">{study.solutions}</p>
                      </div>
                    </div>
                    
                    {/* Impact */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-1">Impact</h4>
                      <p className="text-green-700 text-sm">{study.impact}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Partner With Us
                </h3>
                <p className="text-gray-600 mb-6">
                  Interested in collaborating on healthcare equity initiatives? 
                  We're always looking for community partners to expand our impact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Contact Partnership Team
                  </a>
                  <a
                    href="/donate"
                    className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                  >
                    Support Our Work
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}