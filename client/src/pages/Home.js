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
  <div className="bg-pureWhite min-h-screen font-sans">
    {/* Hero Section */}
    <section className="w-full flex flex-col items-center justify-center text-center py-24 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 60%, #f7fafc 100%)', minHeight: '60vh' }}>
      <div className="absolute inset-0 opacity-60" style={{ background: 'url("/ringstestimages/my-hero-bg.jpg") center/cover no-repeat' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-softGray/60 to-navyBlue/20" style={{ pointerEvents: 'none' }}></div>
      <div className="relative z-10 animate-fadein">
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-4 text-navyBlue drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-1px' }}>
          Grown Lab Diamond
        </h1>
        <p className="text-2xl md:text-3xl mb-4 text-darkGray font-light max-w-2xl mx-auto" style={{ textShadow: '0 2px 8px #edf2f7' }}>
          Where Science Meets Sparkle
        </p>
        <p className="text-lg md:text-xl mb-8 text-mediumGray font-light max-w-3xl mx-auto">
          Discover our collection of ethically grown diamonds and sustainable luxury jewelry. 
          Real brilliance, real impact, no mining required.
        </p>
        <a href="/shop" className="inline-block px-12 py-4 bg-navyBlue text-white font-bold rounded-full shadow-elegant hover:bg-warmGold hover:text-navyBlue transition-all duration-300 text-xl tracking-wide border-2 border-warmGold hover:scale-105 focus:outline-none focus:ring-4 focus:ring-navyBlue/40">
          Shop Now
        </a>
      </div>
      <style>{`
        .text-warmGold { color: #d69e2e; }
        .bg-warmGold { background-color: #d69e2e; }
        .text-navyBlue { color: #1a365d; }
        .bg-navyBlue { background-color: #1a365d; }
        .border-navyBlue { border-color: #1a365d; }
        .bg-pureWhite { background-color: #ffffff; }
        .bg-softGray { background-color: #f7fafc; }
        .text-darkGray { color: #2d3748; }
        .border-warmGold { border-color: #d69e2e; }
        @keyframes fadein { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1.2s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </section>
    {/* Divider */}
    <div className="w-full border-t border-lightGray my-12" />
    {/* Featured Collections */}
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-serif font-bold text-navyBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Featured Collections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-softGray rounded-lg shadow-elegant p-8 border border-navyBlue/30 text-center flex flex-col items-center">
          <img src={process.env.PUBLIC_URL + '/ringstestimages/three stone gold square.jpg'} alt="Wedding Rings" className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-navyBlue/20" />
          <h3 className="font-serif text-xl font-bold mb-2 text-darkGray" style={{ fontFamily: 'Playfair Display, serif' }}>Wedding Rings</h3>
          <p className="text-mediumGray">Timeless bands with ethically grown diamonds.</p>
        </div>
        <div className="bg-softGray rounded-lg shadow-elegant p-8 border border-navyBlue/30 text-center flex flex-col items-center">
          <img src={process.env.PUBLIC_URL + '/ringstestimages/three stone platinum square.jpg'} alt="Engagement Rings" className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-navyBlue/20" />
          <h3 className="font-serif text-xl font-bold mb-2 text-darkGray" style={{ fontFamily: 'Playfair Display, serif' }}>Engagement Rings</h3>
          <p className="text-mediumGray">Lab-grown diamonds for your forever story.</p>
        </div>
        <div className="bg-softGray rounded-lg shadow-elegant p-8 border border-navyBlue/30 text-center flex flex-col items-center">
          <img src={process.env.PUBLIC_URL + '/ringstestimages/vintage rose square.jpg'} alt="Custom Designs" className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-navyBlue/20" />
          <h3 className="font-serif text-xl font-bold mb-2 text-darkGray" style={{ fontFamily: 'Playfair Display, serif' }}>Custom Designs</h3>
          <p className="text-mediumGray">Sustainable luxury, uniquely yours.</p>
        </div>
      </div>
    </section>
    <div className="w-full border-t border-lightGray my-12" />
    {/* Promo Banner */}
    <section className="w-full text-center py-6 bg-navyBlue/10">
      <span className="font-bold text-lg text-navyBlue">Lab-Grown Diamonds: 30% More Brilliant, 100% Ethical!</span>
    </section>
    <div className="w-full border-t border-lightGray my-12" />
    {/* Testimonials */}
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-serif font-bold text-navyBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-pureWhite rounded-lg shadow-elegant p-8 border border-navyBlue/20 text-left">
          <p className="italic text-lg mb-4 text-darkGray">"The lab-grown diamond is absolutely stunning and knowing it's ethical makes it even more special!"</p>
          <span className="block text-navyBlue font-semibold">– Daniel S.</span>
        </div>
        <div className="bg-pureWhite rounded-lg shadow-elegant p-8 border border-navyBlue/20 text-left">
          <p className="italic text-lg mb-4 text-darkGray">"Incredible quality and the custom design process was seamless. Love that it's sustainable!"</p>
          <span className="block text-navyBlue font-semibold">– Sarah L.</span>
        </div>
      </div>
    </section>
    <div className="w-full border-t border-lightGray my-12" />
    {/* Bestsellers Grid */}
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-serif font-bold text-navyBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
        Bestsellers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {bestsellersImages.map((img, i) => (
          <div key={i} className="bg-softGray rounded-lg shadow-elegant p-6 border border-navyBlue/20 flex flex-col items-center justify-center text-darkGray">
            <img src={img} alt={`Bestseller Ring ${i+1}`} className="w-24 h-24 object-cover rounded-full mb-4 border border-navyBlue/10 shadow-inner" />
            <span className="font-serif text-lg font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{`Ring ${i+1}`}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home; 