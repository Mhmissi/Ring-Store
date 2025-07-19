const About = () => (
  <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-brilliantBlue mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        About <span className="text-champagneGold">Shemesh Gold</span>
      </h1>
      <div className="mx-auto w-24 h-1 bg-gradient-to-r from-brilliantBlue via-champagneGold to-brilliantBlue rounded-full mb-4"></div>
    </div>

    {/* Our Story */}
    <section className="mb-16">
      <h2 className="text-2xl font-serif font-bold mb-4 text-brilliantBlue text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Our Story
      </h2>
      <div className="flex justify-center">
        <div className="bg-platinumSilver rounded-2xl shadow-elegant p-8 border border-brilliantBlue/20 max-w-2xl text-center">
          <p className="text-charcoalGray mb-4 leading-relaxed">Founded in the heart of Tel Aviv, Shemesh Gold is dedicated to crafting exquisite rings and fine jewelry that celebrate life's most precious moments. Our artisans blend timeless tradition with modern design, ensuring every piece is as unique as the person who wears it.</p>
          <p className="text-charcoalGray leading-relaxed">We believe in ethical sourcing, exceptional craftsmanship, and personal service. Whether you're designing a custom engagement ring or selecting a gift, we're here to make your experience unforgettable.</p>
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="mb-16">
      <h2 className="text-2xl font-serif font-bold mb-6 text-brilliantBlue text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Why Choose Us?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {VALUES.map((v, i) => (
          <div key={v.title} className="flex flex-col items-center bg-diamondWhite rounded-xl shadow-elegant p-6 border border-brilliantBlue/20 text-center">
            <div className="mb-3">{v.icon}</div>
            <h3 className="font-bold text-lg text-brilliantBlue font-serif mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{v.title}</h3>
            <p className="text-charcoalGray text-sm">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Meet Our Team */}
    <section className="mb-16">
      <h2 className="text-2xl font-serif font-bold mb-6 text-brilliantBlue text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Meet Our Team
      </h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
        {TEAM.map((member, idx) => (
          <div key={member.name} className="flex-1 bg-diamondWhite rounded-xl shadow-elegant p-6 flex flex-col items-center border border-brilliantBlue/20 max-w-xs">
            <div className="w-20 h-20 bg-platinumSilver rounded-full mb-3 flex items-center justify-center text-2xl text-champagneGold font-bold shadow-inner">
              {member.img ? <img src={member.img} alt={member.name} className="rounded-full w-full h-full object-cover" /> : member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="font-semibold text-lg text-brilliantBlue font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{member.name}</h3>
            <p className="text-charcoalGray mb-2">{member.title}</p>
            <div className="mt-2 text-xs text-brilliantBlue bg-platinumSilver rounded px-2 py-1 shadow">
              {member.funFact}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Call to Action */}
    <section className="text-center mt-20">
      <h2 className="text-xl font-serif font-bold mb-4 text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
        Ready to create your story?
      </h2>
      <a href="/contact" className="inline-block mt-3 px-8 py-3 bg-brilliantBlue text-white font-bold rounded-full shadow-elegant hover:bg-champagneGold hover:text-black transition-all duration-200 border border-champagneGold text-lg">
        Contact Us
      </a>
    </section>
  </div>
);

const TEAM = [
  {
    name: "Avi Shemesh",
    title: "Founder & Master Jeweler",
    funFact: "Handcrafts every prototype himself.",
    img: null, // Add image path if available
  },
  {
    name: "Leah Gold",
    title: "Customer Experience Lead",
    funFact: "Loves matching rings to stories.",
    img: null,
  },
];

const VALUES = [
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.657-1.343-3-3-3z" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Ethical Sourcing",
    desc: "Responsibly sourced materials for peace of mind."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Craftsmanship",
    desc: "Every ring is meticulously handcrafted."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Personal Service",
    desc: "Guidance at every step of your journey."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Celebrating Love",
    desc: "Jewelry for life's most meaningful moments."
  },
];

export default About; 