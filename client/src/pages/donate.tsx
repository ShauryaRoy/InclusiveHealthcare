import { useState } from "react";
import Navigation from "@/components/navigation";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import Footer from "@/components/footer";
import DonationForm from "@/components/donation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, Target, Award, Globe, CheckCircle, CreditCard } from "lucide-react";

export default function Donate() {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [showDonationForm, setShowDonationForm] = useState(false);

  const donationImpacts = [
    {
      amount: "$25",
      impact: "Provides interpreter services for one patient visit",
      icon: Globe,
      color: "text-blue-600 bg-blue-100",
      value: 25,
    },
    {
      amount: "$50",
      impact: "Funds accessibility equipment for one examination room",
      icon: Shield,
      color: "text-green-600 bg-green-100",
      value: 50,
    },
    {
      amount: "$100",
      impact: "Supports mental health counseling session for underserved patient",
      icon: Heart,
      color: "text-red-600 bg-red-100",
      value: 100,
    },
    {
      amount: "$250",
      impact: "Sponsors mobile clinic visit to underserved community",
      icon: Users,
      color: "text-purple-600 bg-purple-100",
      value: 250,
    },
  ];

  const programs = [
    {
      title: "Accessibility Enhancement Fund",
      description: "Upgrading facilities and equipment to ensure full accessibility for patients with disabilities",
      raised: "$125,000",
      goal: "$200,000",
      progress: 62,
      icon: Shield,
      id: "accessibility",
    },
    {
      title: "Multilingual Care Initiative",
      description: "Expanding interpreter services and culturally-sensitive care programs",
      raised: "$85,000",
      goal: "$150,000",
      progress: 57,
      icon: Globe,
      id: "multilingual",
    },
    {
      title: "Community Outreach Program",
      description: "Mobile health clinics serving underserved neighborhoods and rural areas",
      raised: "$190,000",
      goal: "$300,000",
      progress: 63,
      icon: Users,
      id: "outreach",
    },
    {
      title: "Mental Health Equity Fund",
      description: "Providing mental health services to communities facing cultural and financial barriers",
      raised: "$95,000",
      goal: "$180,000",
      progress: 53,
      icon: Heart,
      id: "mental-health",
    },
  ];

  const stats = [
    { label: "Patients Helped", value: "15,000+", icon: Users },
    { label: "Communities Served", value: "45", icon: Target },
    { label: "Languages Supported", value: "12", icon: Globe },
    { label: "Accessibility Features", value: "50+", icon: Shield },
  ];

  const testimonials = [
    {
      quote: "Thanks to the donation-funded interpreter services, I finally felt understood during my medical visits. It made all the difference in my care.",
      author: "Maria S.",
      role: "Patient",
    },
    {
      quote: "The mobile clinic funded by donations brought essential healthcare right to our neighborhood. My children now get regular check-ups.",
      author: "Ahmed R.",
      role: "Community Member",
    },
    {
      quote: "The accessibility improvements funded by generous donors made our hospital truly welcoming for patients with disabilities.",
      author: "Dr. Sarah Kim",
      role: "Accessibility Coordinator",
    },
  ];

  return (
    <div className="min-h-screen">
      <AccessibilityToolbar />
      <Navigation />
      
      <main id="main-content" role="main" className="py-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Support Inclusive Healthcare
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your donation breaks down barriers to healthcare access and creates 
              a more equitable future for all patients, regardless of background or ability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="#donation-form">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#impact-stats">
                  Learn About Our Impact
                </a>
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Impact Stats */}
          <section id="impact-stats" className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Your Donations at Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          </section>

          {/* Donation Impact */}
          <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              See Your Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationImpacts.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-4`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.amount}</h3>
                    <p className="text-gray-600 text-sm">{item.impact}</p>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        setSelectedAmount(item.value);
                        setSelectedProgram("general");
                        setShowDonationForm(true);
                        document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Donate {item.amount}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Current Programs */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Current Fundraising Programs
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <program.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{program.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {program.progress}% funded
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Raised: {program.raised}</span>
                        <span>Goal: {program.goal}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedAmount(100);
                        setSelectedProgram(program.id);
                        setShowDonationForm(true);
                        document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Support This Program
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Stories of Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="pt-6">
                    <blockquote className="text-gray-600 italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Donation Methods */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ways to Give
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the donation method that works best for you. Every contribution 
                makes a meaningful difference in someone's healthcare journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">One-Time Donation</h3>
                  <p className="text-gray-600 mb-6">Make an immediate impact with a secure online donation</p>
                  <Button className="w-full">Donate Once</Button>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-blue-500">
                <CardContent className="pt-8">
                  <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Giving</h3>
                  <p className="text-gray-600 mb-6">Provide ongoing support with automatic monthly donations</p>
                  <Button className="w-full">Give Monthly</Button>
                  <Badge className="mt-2">Most Popular</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Corporate Giving</h3>
                  <p className="text-gray-600 mb-6">Partner with us through corporate sponsorship programs</p>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Trust & Transparency */}
          <section className="py-16 bg-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Trust Matters
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to transparency and accountability in how we use your donations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">95% Direct Impact</h3>
                <p className="text-gray-600 text-sm">Of donations go directly to programs</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Secure Processing</h3>
                <p className="text-gray-600 text-sm">Bank-level security for all transactions</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Certified Nonprofit</h3>
                <p className="text-gray-600 text-sm">501(c)(3) tax-exempt organization</p>
              </div>
              <div className="text-center">
                <Target className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Annual Reports</h3>
                <p className="text-gray-600 text-sm">Detailed impact reporting available</p>
              </div>
            </div>
          </section>

          {/* Donation Form */}
          <section id="donation-form" className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Make Your Donation Today
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every dollar directly supports inclusive healthcare initiatives 
                and helps us serve patients who need it most.
              </p>
            </div>
            <DonationForm 
              initialAmount={selectedAmount > 0 ? selectedAmount : 25}
              initialProgram={selectedProgram}
              onSuccess={() => {
                setShowDonationForm(false);
                setSelectedAmount(0);
                setSelectedProgram("");
              }}
            />
          </section>

          {/* Contact for Large Donations */}
          <section className="py-16">
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Planning a Major Gift?
                </h3>
                <p className="text-gray-600 mb-6">
                  For donations over $10,000, planned giving, or estate planning, 
                  our development team is here to help you maximize your impact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button>
                    Contact Development Team
                  </Button>
                  <Button variant="outline">
                    Download Giving Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}