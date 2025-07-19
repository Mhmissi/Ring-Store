import React from "react";
// Framer Motion import for future animation
// import { motion } from "framer-motion";

const bestsellersImages = [
  process.env.PUBLIC_URL + '/ringstestimages/three stone gold round.jpg',
  process.env.PUBLIC_URL + '/ringstestimages/three stone platinum round.jpg',
  process.env.PUBLIC_URL + '/ringstestimages/vintage gold ring diamond round.jpg',
  process.env.PUBLIC_URL + '/ringstestimages/halo seting gold ring.jpg',
];

const Home = () => (
  <div className="bg-diamondWhite min-h-screen font-sans">
    {/* Hero Section */}
    <section className="w-full flex flex-col items-center justify-center text-center py-24 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8F9FA 60%, #E5E4E2 100%)', minHeight: '60vh' }}>
      <div className="absolute inset-0 opacity-60" style={{ background: 'url("/ringstestimages/my-hero-bg.jpg") center/cover no-repeat' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-platinumSilver/60 to-brilliantBlue/20" style={{ pointerEvents: 'none' }}></div>
      <div className="relative z-10 animate-fadein">
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-4 text-brilliantBlue drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-1px' }}>
          Shemesh Gold
        </h1>
        <p className="text-2xl md:text-3xl mb-8 text-charcoalGray font-light max-w-2xl mx-auto" style={{ textShadow: '0 2px 8px #E5E4E2' }}>
          Exquisite Rings for Life's Most Precious Moments
        </p>
        <a href="/shop" className="inline-block px-12 py-4 bg-brilliantBlue text-white font-bold rounded-full shadow-elegant hover:bg-champagneGold hover:text-black transition-all duration-300 text-xl tracking-wide border-2 border-champagneGold hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brilliantBlue/40">
          Shop Now
        </a>
      </div>
      <style>{`
        .text-gold { color: #bfa14a; }
        .bg-gold { background-color: #bfa14a; }
        .text-brilliantBlue { color: #4F8EF7; }
        .bg-brilliantBlue { background-color: #4F8EF7; }
        .border-brilliantBlue { border-color: #4F8EF7; }
        .bg-diamondWhite { background-color: #F8F9FA; }
        .bg-platinumSilver { background-color: #E5E4E2; }
        .text-charcoalGray { color: #333333; }
        .bg-champagneGold { background-color: #FFD700; }
        .border-champagneGold { border-color: #FFD700; }
        @keyframes fadein { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </section>
    {/* Divider */}
    <div className="w-full border-t border-platinumSilver my-12" />
    {/* Featured Collections */}
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-serif font-bold text-brilliantBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Featured Collections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-platinumSilver rounded-lg shadow-elegant p-8 border border-brilliantBlue/30 text-center flex flex-col items-center">
          <img src={process.env.PUBLIC_URL + '/ringstestimages/three stone gold square.jpg'} alt="Wedding Rings" className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-brilliantBlue/20" />
          <h3 className="font-serif text-xl font-bold mb-2 text-charcoalGray" style={{ fontFamily: 'Playfair Display, serif' }}>Wedding Rings</h3>
          <p className="text-gray-700">Timeless bands for your forever.</p>
        </div>
        <div className="bg-platinumSilver rounded-lg shadow-elegant p-8 border border-brilliantBlue/30 text-center flex flex-col items-center">
          <img src={process.env.PUBLIC_URL + '/ringstestimages/three stone platinum square.jpg'} alt="Engagement Rings" className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-brilliantBlue/20" />
          <h3 className="font-serif text-xl font-bold mb-2 text-charcoalGray" style={{ fontFamily: 'Playfair Display, serif' }}>Engagement Rings</h3>
          <p className="text-gray-700">Celebrate your unique love story.</p>
        </div>
        <div className="bg-platinumSilver rounded-lg shadow-elegant p-8 border border-brilliantBlue/30 text-center flex flex-col items-center">
          <img src={process.env.PUBLIC_URL + '/ringstestimages/vintage rose square.jpg'} alt="Custom Designs" className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-brilliantBlue/20" />
          <h3 className="font-serif text-xl font-bold mb-2 text-charcoalGray" style={{ fontFamily: 'Playfair Display, serif' }}>Custom Designs</h3>
          <p className="text-gray-700">Design a ring as unique as you.</p>
        </div>
      </div>
    </section>
    <div className="w-full border-t border-platinumSilver my-12" />
    {/* Promo Banner */}
    <section className="w-full text-center py-6 bg-brilliantBlue/10">
      <span className="font-bold text-lg text-brilliantBlue">Summer Sale: 10% Off All Custom Rings!</span>
    </section>
    <div className="w-full border-t border-platinumSilver my-12" />
    {/* Testimonials */}
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-serif font-bold text-brilliantBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-diamondWhite rounded-lg shadow-elegant p-8 border border-brilliantBlue/20 text-left">
          <p className="italic text-lg mb-4 text-charcoalGray">“Absolutely stunning craftsmanship. My fiancée loved her ring!”</p>
          <span className="block text-brilliantBlue font-semibold">– Daniel S.</span>
        </div>
        <div className="bg-diamondWhite rounded-lg shadow-elegant p-8 border border-brilliantBlue/20 text-left">
          <p className="italic text-lg mb-4 text-charcoalGray">“The custom design process was so easy and fun. Highly recommend!”</p>
          <span className="block text-brilliantBlue font-semibold">– Sarah L.</span>
        </div>
      </div>
    </section>
    <div className="w-full border-t border-platinumSilver my-12" />
    {/* Bestsellers Grid */}
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-serif font-bold text-brilliantBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Bestsellers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {bestsellersImages.map((img, i) => (
          <div key={i} className="bg-platinumSilver rounded-lg shadow-elegant p-6 border border-brilliantBlue/20 flex flex-col items-center justify-center text-charcoalGray">
            <img src={img} alt={`Bestseller Ring ${i+1}`} className="w-24 h-24 object-cover rounded-full mb-4 border border-brilliantBlue/10 shadow-inner" />
            <span className="font-serif text-lg font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{`Ring ${i+1}`}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home; 