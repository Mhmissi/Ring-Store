import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabase';
// Framer Motion import for future animation
// import { motion } from "framer-motion";



// Ring images for the slideshow
const storyRingImages = [
  {
    image: process.env.PUBLIC_URL + '/ringstestimages/halo seting platinum diamond round.webp',
    title: "Platinum Halo Diamond Ring",
    description: "Elegant platinum setting with brilliant round diamond"
  },
  {
    image: process.env.PUBLIC_URL + '/ringstestimages/three stone gold square.jpg',
    title: "Three Stone Gold Square",
    description: "Classic three-stone design with square-cut diamonds"
  },
  {
    image: process.env.PUBLIC_URL + '/ringstestimages/vintage platinum diamond round.jpg',
    title: "Vintage Platinum Round",
    description: "Timeless vintage-inspired platinum ring"
  },
  {
    image: process.env.PUBLIC_URL + '/ringstestimages/halo seting ring rose diamond square.webp',
    title: "Rose Gold Halo Square",
    description: "Romantic rose gold with square diamond halo"
  },
  {
    image: process.env.PUBLIC_URL + '/ringstestimages/three stone platinum square.jpg',
    title: "Three Stone Platinum Square",
    description: "Sophisticated platinum three-stone ring"
  },
  {
    image: process.env.PUBLIC_URL + '/ringstestimages/vintage rose diamon round.jpg',
    title: "Vintage Rose Gold Round",
    description: "Vintage charm with rose gold and round diamond"
  }
];

const Home = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestsellers, setBestsellers] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bestsellers data
  useEffect(() => {
    const fetchBestsellers = async () => {
      setLoading(true);
      try {
        // Fetch products (limit to 20 to ensure we have enough discounted products)
        const { data: productsData, error: productsError } = await supabase
          .from('ring_images')
          .select('*')
          .limit(20)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Fetch pricing data
        const { data: pricingData, error: pricingError } = await supabase
          .from('ring_pricing')
          .select('*');

        if (pricingError) throw pricingError;

        // Fetch active discounts (temporarily removing date filter for testing)
        const { data: discountsData, error: discountsError } = await supabase
          .from('product_discounts')
          .select('*')
          .eq('is_active', true);

        if (discountsError) throw discountsError;

        setBestsellers(productsData || []);
        setPricingData(pricingData || []);
        setDiscounts(discountsData || []);
        
        // Debug logging
        console.log('Fetched discounts:', discountsData);
        console.log('Fetched products:', productsData?.length);
        console.log('Fetched pricing:', pricingData?.length);
        console.log('Current date:', new Date().toISOString().split('T')[0]);
        
        // Log all products to see their structure
        if (productsData && productsData.length > 0) {
          console.log('All products:', productsData.map(p => ({
            id: p.id,
            design: p.design,
            metal: p.metal,
            shape: p.diamond_shape,
            carat: p.carat
          })));
        }
        
        // Log all discounts to see their structure
        if (discountsData && discountsData.length > 0) {
          console.log('All discounts:', discountsData.map(d => ({
            id: d.id,
            design: d.design,
            metal: d.metal,
            shape: d.shape,
            percentage: d.discount_percentage,
            is_active: d.is_active
          })));
        }
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
        setBestsellers([]);
        setPricingData([]);
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % storyRingImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    console.log('Submitting contact form:', form);
    try {
      const { data, error } = await supabase.from('messages').insert({
        name: form.name,
        email: form.email,
        message: form.message,
        status: 'unread'
      });
      console.log('Supabase insert result:', { data, error });
      if (error) throw error;
      setStatus('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Error sending message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storyRingImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storyRingImages.length) % storyRingImages.length);
  };

  // Get pricing for a design and carat
  const getPriceForDesignAndCarat = (design, carat) => {
    const pricing = pricingData.find(p => p.design === design);
    if (!pricing) return null;
    switch (carat) {
      case 1.0:
      case '1.0':
        return pricing.price_1_0ct;
      case 1.5:
      case '1.5':
        return pricing.price_1_5ct;
      case 2.0:
      case '2.0':
        return pricing.price_2_0ct;
      case 2.5:
      case '2.5':
        return pricing.price_2_5ct;
      default:
        return pricing.price_1_0ct;
    }
  };

  // Get discount for a product
  const getDiscountForProduct = (product) => {
    console.log('Checking discounts for product:', product.design, 'Available discounts:', discounts.length);
    
    const applicableDiscounts = discounts.filter(discount => {
      // Design matching - more flexible
      let designMatch = false;
      if (!discount.design) {
        designMatch = true; // No design filter means all designs
      } else {
        const discountDesign = discount.design.toLowerCase();
        const productDesign = product.design.toLowerCase();
        
        // Handle different design naming conventions
        if (discountDesign.includes('three stone') || discountDesign.includes('trinity')) {
          designMatch = productDesign.includes('three-stone') || productDesign.includes('three stone');
        } else if (discountDesign.includes('halo')) {
          designMatch = productDesign.includes('halo');
        } else if (discountDesign.includes('solitaire')) {
          designMatch = productDesign.includes('solitaire') || productDesign.includes('classic');
        } else {
          // Fallback to partial matching
          designMatch = discountDesign === productDesign || 
                       productDesign.includes(discountDesign) || 
                       discountDesign.includes(productDesign);
        }
      }
      
      // Metal matching - more flexible
      let metalMatch = true;
      if (discount.metal) {
        const discountMetal = discount.metal.toLowerCase();
        const productMetal = product.metal.toLowerCase();
        
        // Handle different metal naming conventions
        if (discountMetal.includes('white') || discountMetal.includes('14k') || discountMetal.includes('18k')) {
          metalMatch = productMetal.includes('white') || productMetal.includes('platinum');
        } else if (discountMetal.includes('yellow')) {
          metalMatch = productMetal.includes('yellow');
        } else if (discountMetal.includes('rose')) {
          metalMatch = productMetal.includes('rose');
        } else {
          metalMatch = discountMetal === productMetal;
        }
      }
      
      // Shape matching - more flexible
      let shapeMatch = true;
      if (discount.shape) {
        const discountShape = discount.shape.toLowerCase();
        const productShape = product.diamond_shape.toLowerCase();
        
        if (discountShape.includes('round') || discountShape.includes('brilliant')) {
          shapeMatch = productShape.includes('round');
        } else if (discountShape.includes('oval')) {
          shapeMatch = productShape.includes('oval');
        } else if (discountShape.includes('square')) {
          shapeMatch = productShape.includes('square');
        } else {
          shapeMatch = discountShape === productShape;
        }
      }
      
      // Debug logging for discount matching
      console.log('Discount matching for product:', product.design, {
        discountDesign: discount.design,
        discountMetal: discount.metal,
        discountShape: discount.shape,
        productDesign: product.design,
        productMetal: product.metal,
        productShape: product.diamond_shape,
        designMatch,
        metalMatch,
        shapeMatch,
        isMatch: designMatch && metalMatch && shapeMatch
      });
      
      return designMatch && metalMatch && shapeMatch;
    });
    
    console.log('Applicable discounts for', product.design, ':', applicableDiscounts);
    
    // Return the highest discount percentage
    if (applicableDiscounts.length > 0) {
      const bestDiscount = applicableDiscounts.reduce((max, discount) => 
        discount.discount_percentage > max.discount_percentage ? discount : max
      );
      console.log('Best discount for', product.design, ':', bestDiscount);
      return bestDiscount;
    }
    
    console.log('No discount found for', product.design);
    return null;
  };

  // Calculate discounted price
  const getDiscountedPrice = (product) => {
    const discount = getDiscountForProduct(product);
    if (!discount) return null;
    const originalPrice = getPriceForDesignAndCarat(product.design, product.carat);
    if (!originalPrice) return null;
    return originalPrice * (1 - discount.discount_percentage / 100);
  };

  return (
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
    {/* Special Discounts Section */}
    <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-serif font-bold text-navyBlue mb-4 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Special Offers & Discounts
        </h2>
        <p className="text-lg text-mediumGray text-center mb-12 max-w-2xl mx-auto">
          Discover our exclusive deals on lab-grown diamond rings. Limited time offers for the perfect engagement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Black Friday Special */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-elegant p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
              🔥 Limited Time
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Black Friday Special</h3>
              <p className="text-red-100 mb-4">Up to 50% off on selected engagement rings</p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold">50%</span>
                <span className="text-red-100">OFF</span>
              </div>
              <a href="/shop" className="inline-block bg-white text-red-600 font-bold px-6 py-3 rounded-full hover:bg-red-50 transition-all duration-200">
                Shop Now
              </a>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          </div>

          {/* New Customer Discount */}
          <div className="bg-gradient-to-br from-warmGold to-yellow-500 rounded-2xl shadow-elegant p-8 text-navyBlue relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
              ✨ New Customer
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">First Purchase</h3>
              <p className="text-navyBlue/80 mb-4">Get 25% off your first lab-grown diamond ring</p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold">25%</span>
                <span className="text-navyBlue/80">OFF</span>
              </div>
              <a href="/auth" className="inline-block bg-navyBlue text-white font-bold px-6 py-3 rounded-full hover:bg-navyBlue/90 transition-all duration-200">
                Sign Up & Save
              </a>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
          </div>

          {/* Custom Design Discount */}
          <div className="bg-gradient-to-br from-navyBlue to-blue-600 rounded-2xl shadow-elegant p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
              💎 Custom Design
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Custom Ring Design</h3>
              <p className="text-blue-100 mb-4">15% off when you design your own ring</p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold">15%</span>
                <span className="text-blue-100">OFF</span>
              </div>
              <a href="/customize" className="inline-block bg-white text-navyBlue font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-200">
                Start Designing
              </a>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          </div>
        </div>


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
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navyBlue"></div>
          <p className="mt-4 text-mediumGray">Loading bestsellers...</p>
        </div>
      ) : bestsellers.filter(product => getDiscountForProduct(product) !== null).length === 0 ? (
        <div className="text-center py-12 text-mediumGray">
          <p>No discounted products available at the moment.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestsellers
            .filter(product => {
              const discount = getDiscountForProduct(product);
              return discount !== null;
            })
            .slice(0, 3)
            .map((product, i) => {
            const imageUrl = product.public_url || (product.image_url
              ? supabase.storage.from('ring-images').getPublicUrl(product.image_url).data.publicUrl
              : '/placeholder-ring.png');
            const price = getPriceForDesignAndCarat(product.design, product.carat);
            const discount = getDiscountForProduct(product);
            const discountedPrice = discount ? getDiscountedPrice(product) : price;
            
            // Debug logging
            console.log('Product:', product.design, 'Price:', price, 'Discount:', discount, 'Discounted Price:', discountedPrice);
            console.log('Product details:', {
              design: product.design,
              metal: product.metal,
              shape: product.diamond_shape,
              carat: product.carat,
              hasDiscount: !!discount,
              discountPercentage: discount?.discount_percentage
            });
            
            return (
              <a 
                key={product.id} 
                href={`/product/${product.id}`}
                className="bg-softGray rounded-lg shadow-elegant p-6 border border-navyBlue/20 flex flex-col items-center justify-center text-darkGray hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt={`${product.design} Ring`} 
                    className="w-24 h-24 object-cover rounded-full mb-4 border border-navyBlue/10 shadow-inner group-hover:shadow-lg transition-shadow duration-300" 
                  />
                  {discount && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {discount.discount_percentage}% OFF
                    </div>
                  )}
                </div>
                <span className="font-serif text-lg font-bold mb-2 text-navyBlue group-hover:text-warmGold transition-colors duration-300 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.design}
                </span>
                <p className="text-mediumGray text-sm text-center mb-2">
                  {product.metal} • {product.diamond_shape} • {product.carat} ct
                </p>
                <div className="text-center">
                  {discount && discountedPrice ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                          ${Math.round(discountedPrice).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm line-through">
                          ${Math.round(price).toLocaleString()}
                        </span>
                      </div>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {discount.discount_percentage}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-warmGold font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {price ? `$${Math.round(price).toLocaleString()}` : 'Price on request'}
                    </span>
                  )}
                </div>
                <div className="mt-3 text-xs text-navyBlue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Details →
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
      
      <div className="w-full border-t border-lightGray my-12" />
      
      {/* About Section - Our Story */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-serif font-bold text-navyBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Our Story
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="bg-softGray rounded-2xl shadow-elegant p-8 border border-navyBlue/20">
            <p className="text-darkGray mb-4 leading-relaxed">Grown Lab Diamond is at the forefront of the sustainable jewelry revolution. We specialize in creating stunning lab-grown diamonds that offer the same brilliance, clarity, and beauty as mined diamonds, but with a clear conscience and a smaller environmental footprint.</p>
            <p className="text-darkGray leading-relaxed">Our mission is to provide ethically conscious consumers with access to luxury jewelry that doesn't compromise on quality or style. Every piece in our collection represents the perfect harmony of cutting-edge technology and timeless elegance.</p>
          </div>
          
          {/* Ring Slideshow */}
          <div className="relative">
            <div className="bg-pureWhite rounded-2xl shadow-elegant p-6 border border-navyBlue/20">
              <div className="relative overflow-hidden rounded-xl" style={{ height: '500px' }}>
                {storyRingImages.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-800 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                  >
                    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-softGray to-pureWhite">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-4"
                        style={{ maxHeight: '400px', maxWidth: '400px' }}
                      />
                    </div>
                    
                    {/* Product Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-2xl font-serif font-bold mb-2 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-white/95 text-base mb-4 leading-relaxed">{item.description}</p>
                      <div className="flex items-center space-x-3">
                        <span className="bg-warmGold text-navyBlue px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          Lab-Grown Diamond
                        </span>
                        <span className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white border border-white/30">
                          Ethically Sourced
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-navyBlue p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-navyBlue p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Slide Indicators */}
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  {storyRingImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-warmGold scale-125 shadow-lg' : 'bg-white/70 hover:bg-white/90'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Slideshow Caption */}
              <div className="mt-8 text-center">
                <p className="text-darkGray font-medium text-xl">Discover Our Collection</p>
                <p className="text-mediumGray text-base mt-2">Lab-grown diamonds with exceptional beauty and ethical sourcing</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="w-full border-t border-lightGray my-12" />
      
      {/* About Section - Why Choose Lab-Grown Diamonds */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-serif font-bold text-navyBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
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
      
      <div className="w-full border-t border-lightGray my-12" />
      
      {/* Contact Section */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-serif font-bold text-navyBlue mb-10 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Get In Touch
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-softGray rounded-xl shadow-elegant p-8 border border-navyBlue/20">
            <h3 className="text-xl font-bold text-navyBlue mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navyBlue mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-navyBlue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue/40 bg-pureWhite text-darkGray" 
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navyBlue mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-navyBlue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue/40 bg-pureWhite text-darkGray" 
                  placeholder="you@email.com" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navyBlue mb-1">Message</label>
                <textarea 
                  name="message" 
                  value={form.message} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-navyBlue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue/40 bg-pureWhite text-darkGray" 
                  rows={4} 
                  placeholder="How can we help you with your lab-grown diamond needs?" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full bg-navyBlue hover:bg-warmGold hover:text-navyBlue text-white font-bold px-6 py-3 rounded-lg shadow-elegant transition-all duration-200 border border-warmGold disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
              {status && (
                <div className={`text-center mt-2 p-3 rounded-lg ${
                  status.startsWith('Error') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {status}
                </div>
              )}
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="bg-pureWhite rounded-xl shadow-elegant p-8 border border-navyBlue/20">
            <h3 className="text-xl font-bold text-navyBlue mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-navyBlue mb-2">Grown Lab Diamond</h4>
                <p className="text-darkGray">Leading provider of ethically grown diamonds and sustainable luxury jewelry.</p>
              </div>
              <div>
                <h4 className="font-semibold text-navyBlue mb-2">Address</h4>
                <p className="text-darkGray">123 Diamond Avenue<br />Global Headquarters</p>
              </div>
              <div>
                <h4 className="font-semibold text-navyBlue mb-2">Phone</h4>
                <p className="text-darkGray">+972 3-123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold text-navyBlue mb-2">Email</h4>
                <p className="text-darkGray">
                  <a href="mailto:info@grownlabdiamond.com" className="text-navyBlue hover:text-warmGold transition">
                    info@grownlabdiamond.com
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-navyBlue mb-2">Business Hours</h4>
                <p className="text-darkGray">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
      </div>
    </section>
  </div>
);
};

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

export default Home; 