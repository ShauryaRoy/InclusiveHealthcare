export default function StaffSection() {
  const staffMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Emergency Medicine Chief",
      languages: "English, Spanish, French",
      experience: "15+ years specializing in emergency care with focus on trauma and critical care",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Dr. Sarah Johnson, an African American female doctor in professional medical attire",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      languages: "English, Mandarin, Cantonese",
      experience: "Internationally recognized expert in minimally invasive cardiac procedures",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Dr. Michael Chen, an Asian male doctor wearing a white coat and stethoscope",
    },
    {
      name: "Maria Rodriguez, NP",
      role: "Nurse Practitioner",
      languages: "English, Spanish",
      experience: "Specializes in family medicine and women's health with community outreach focus",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Maria Rodriguez, a Latina nurse practitioner in professional nursing attire",
    },
    {
      name: "Dr. Amara Okafor",
      role: "Pediatric Surgeon",
      languages: "English, Igbo, French",
      experience: "Board-certified pediatric surgeon specializing in minimally invasive procedures",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Dr. Amara Okafor, a professional African woman in surgical attire",
    },
    {
      name: "Dr. David Kim",
      role: "Mental Health Director",
      languages: "English, Korean",
      experience: "Culturally responsive mental health services with trauma-informed care approach",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Dr. David Kim, an Asian male therapist in professional attire",
    },
    {
      name: "Dr. Fatima Al-Rashid",
      role: "Internal Medicine",
      languages: "English, Arabic, Urdu",
      experience: "Primary care physician with expertise in chronic disease management",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Dr. Fatima Al-Rashid, a professional Middle Eastern woman in medical coat",
    },
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="staff-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="staff-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Meet Our Diverse Medical Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our healthcare professionals come from diverse backgrounds and speak multiple languages,
            ensuring every patient feels understood and comfortable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffMembers.map((member, index) => (
            <div key={index} className="staff-card">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
                  <span className="text-xs font-medium text-blue-600">
                    {member.languages.split(',')[0]}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Languages:</strong> {member.languages}
                </p>
                <p className="text-sm text-gray-500">{member.experience}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Commitment to Diversity
            </h3>
            <p className="text-gray-600 mb-6">
              We actively recruit healthcare professionals from diverse backgrounds to ensure our team
              reflects the communities we serve. Our staff speaks over 15 languages and represents
              cultures from around the world.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-600">Languages Spoken</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">500+</div>
                <div className="text-sm text-gray-600">Medical Staff</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Emergency Care</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">50+</div>
                <div className="text-sm text-gray-600">Specialties</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
