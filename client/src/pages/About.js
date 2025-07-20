const About = () => (
  <div className="bg-pureWhite min-h-screen font-sans px-4 py-12">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-navyBlue mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        About <span className="text-warmGold">Grown Lab Diamond</span>
      </h1>
      <div className="mx-auto w-24 h-1 bg-gradient-to-r from-navyBlue via-warmGold to-navyBlue rounded-full mb-4"></div>
    </div>

    {/* Our Story */}
    <section className="mb-16">
      <h2 className="text-2xl font-serif font-bold mb-4 text-navyBlue text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Our Story
      </h2>
      <div className="flex justify-center">
        <div className="bg-softGray rounded-2xl shadow-elegant p-8 border border-navyBlue/20 max-w-2xl text-center">
          <p className="text-darkGray mb-4 leading-relaxed">Grown Lab Diamond is at the forefront of the sustainable jewelry revolution. We specialize in creating stunning lab-grown diamonds that offer the same brilliance, clarity, and beauty as mined diamonds, but with a clear conscience and a smaller environmental footprint.</p>
          <p className="text-darkGray leading-relaxed">Our mission is to provide ethically conscious consumers with access to luxury jewelry that doesn't compromise on quality or style. Every piece in our collection represents the perfect harmony of cutting-edge technology and timeless elegance.</p>
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="mb-16">
      <h2 className="text-2xl font-serif font-bold mb-6 text-navyBlue text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Why Choose Lab-Grown Diamonds?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {VALUES.map((v, i) => (
          <div key={v.title} className="flex flex-col items-center bg-pureWhite rounded-xl shadow-elegant p-6 border border-navyBlue/20 text-center">
            <div className="mb-3">{v.icon}</div>
            <h3 className="font-bold text-lg text-navyBlue font-serif mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{v.title}</h3>
            <p className="text-darkGray text-sm">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Call to Action */}
    <section className="text-center mt-20">
      <h2 className="text-xl font-serif font-bold mb-4 text-navyBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
        Ready to discover sustainable luxury?
      </h2>
      <a href="/shop" className="inline-block mt-3 px-8 py-3 bg-navyBlue text-white font-bold rounded-full shadow-elegant hover:bg-warmGold hover:text-navyBlue transition-all duration-200 border border-warmGold text-lg">
        Shop Our Collection
      </a>
    </section>
  </div>
);

const VALUES = [
  {
    icon: (
      <svg className="w-8 h-8 text-warmGold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.657-1.343-3-3-3z" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Ethical & Sustainable",
    desc: "100% conflict-free diamonds with minimal environmental impact."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-warmGold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Superior Quality",
    desc: "Lab-grown diamonds with exceptional clarity and brilliance."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-warmGold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Innovation",
    desc: "Cutting-edge technology meets timeless beauty."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-warmGold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Accessible Luxury",
    desc: "Premium quality at a fraction of the environmental cost."
  },
];

export default About; 