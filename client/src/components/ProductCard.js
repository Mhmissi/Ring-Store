import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

const metalColors = {
  'white-gold': '#e5e4e2',
  'yellow-gold': '#ffe066',
  'rose-gold': '#e6b7a9',
  'platinum': '#bfc1c2',
};
const metalLabels = {
  'white-gold': 'White Gold',
  'yellow-gold': 'Yellow Gold',
  'rose-gold': 'Rose Gold',
  'platinum': 'Platinum',
};
const caratOptions = [
  { value: '1.0', label: '1.0ct F-G VS+' },
  { value: '1.5', label: '1.5ct F-G VS+' },
  { value: '2.0', label: '2.0ct F-G VS+' },
  { value: '2.5', label: '2.5ct F-G VS+' },
];

const ProductCard = ({ ring, onAddToCart }) => {
  const { t } = useLanguage();
  const [selectedMetal, setSelectedMetal] = useState(ring.metal);
  const [selectedCarat, setSelectedCarat] = useState('1.0');
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [discount, setDiscount] = useState(null);
  const imageRef = useRef(null);
  const imageUrl = ring.images[selectedMetal] || ring.images[ring.metal] || '/placeholder-ring.png';

  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);

  // Fetch discount for this product
  useEffect(() => {
    const fetchDiscount = async () => {
      const { data: discounts, error } = await supabase
        .from('product_discounts')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString().split('T')[0])
        .or('end_date.is.null,end_date.gte.' + new Date().toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching discounts:', error);
        return;
      }

      // Find applicable discount for this product - more flexible matching
      const applicableDiscount = discounts?.find(discount => {
        // More flexible matching - check if any field matches or is null (meaning apply to all)
        const designMatch = !discount.design || 
                           discount.design === ring.design || 
                           discount.design === ring.designLabel ||
                           discount.design === 'classic-solitaire'; // Fallback for common design
        
        const metalMatch = !discount.metal || 
                          discount.metal === selectedMetal ||
                          discount.metal === 'white-gold'; // Fallback for common metal
        
        const shapeMatch = !discount.shape || 
                          discount.shape === (ring.shape || ring.diamond_shape) ||
                          discount.shape === 'princess' || // Fallback for common shape
                          discount.shape === 'round';
        
        // If any discount has null values for design/metal/shape, it applies to all
        const isUniversalDiscount = !discount.design && !discount.metal && !discount.shape;
        
        return (designMatch && metalMatch && shapeMatch) || isUniversalDiscount;
      });

      if (applicableDiscount) {
        setDiscount(applicableDiscount);
      }
    };

    fetchDiscount();
  }, [ring.design, selectedMetal, ring.shape, ring.diamond_shape, ring.designLabel]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    const wishlist = stored ? JSON.parse(stored) : [];
    setInWishlist(wishlist.some(item => item.id === ring.id));
  }, [ring.id]);

  const toggleWishlist = () => {
    const stored = localStorage.getItem('wishlist');
    let wishlist = stored ? JSON.parse(stored) : [];
    if (inWishlist) {
      wishlist = wishlist.filter(item => item.id !== ring.id);
    } else {
      wishlist.push({
        id: ring.id,
        name: ring.designLabel,
        image: imageUrl,
        price: getPriceForCarat(selectedCarat),
        metal: selectedMetal,
        design: ring.design,
        shape: ring.shape,
      });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setInWishlist(!inWishlist);
  };

  // Get price based on selected carat
  const getPriceForCarat = (carat) => {
    if (!ring.priceData) return ring.price || 5000;
    
    switch (carat) {
      case '1.0':
        return ring.priceData.price_1_0ct || 5000;
      case '1.5':
        return ring.priceData.price_1_5ct || 7500;
      case '2.0':
        return ring.priceData.price_2_0ct || 10000;
      case '2.5':
        return ring.priceData.price_2_5ct || 12500;
      default:
        return ring.priceData.price_1_0ct || 5000;
    }
  };

  const currentPrice = getPriceForCarat(selectedCarat);

  // Handle mouse move for zoom
  const handleMouseMove = (e) => {
    if (!zoom || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  // Toggle zoom on click
  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setZoom(prevZoom => !prevZoom);
    if (!zoom) {
      handleMouseMove(e);
    }
  };

  // Close zoom when clicking outside
  const handleZoomClick = (e) => {
    e.stopPropagation();
    setZoom(false);
  };

  return (
    <div className="w-full max-w-5xl bg-pureWhite rounded-lg shadow-elegant p-4 sm:p-6 flex flex-col xl:flex-row gap-4 sm:gap-8 items-start border border-navyBlue/20 mx-auto">
      {/* Left: Image and Metal Selector */}
      <div className="flex flex-col items-center xl:items-start w-full xl:w-1/2">
        <div className="w-full flex flex-col items-center relative">
          {/* Heart Icon Button */}
          <button
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 rounded-full p-1.5 sm:p-2 bg-pureWhite/90 border border-warmGold shadow-elegant transition hover:bg-warmGold hover:text-navyBlue ${inWishlist ? 'text-red-500' : 'text-navyBlue'}`}
            onClick={toggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{ outline: 'none' }}
          >
            {inWishlist ? (
              // Filled heart
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              // Outline heart
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3c-1.74 0-3.41 0.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
              </svg>
            )}
          </button>
          <div
            ref={imageRef}
            className="w-80 h-80 sm:w-[28rem] sm:h-[28rem] mb-3 sm:mb-4 rounded-lg shadow-elegant overflow-hidden bg-softGray relative cursor-zoom-in border border-navyBlue/10"
            style={{ position: 'relative' }}
            onMouseMove={handleMouseMove}
            onClick={handleImageClick}
            tabIndex={0}
            role="button"
            aria-label="Click to zoom product image"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick(e);
              }
            }}
          >
            {/* Attractive Discount Badge */}
            {discount && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold shadow-lg border border-white transform rotate-[-5deg] animate-pulse">
                🔥 {discount.discount_percentage}% OFF
              </div>
            )}
            
            <img
              src={imageUrl}
              alt={ring.designLabel}
              className="w-full h-full object-contain"
              draggable={false}
              style={{ pointerEvents: 'none' }}
            />
            {/* Zoom indicator */}
            {!zoom && (
              <div className="absolute top-2 right-2 bg-navyBlue/80 text-white text-xs px-2 py-1 rounded shadow-elegant">
                Click to zoom
              </div>
            )}
            {/* Zoomed image overlay */}
            {zoom && (
              <div
                className="fixed z-50 border-2 border-warmGold rounded-lg shadow-2xl bg-pureWhite"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '400px',
                  height: '400px',
                  backgroundImage: `url(${imageUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200% 200%',
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)',
                  display: 'block',
                }}
                onClick={handleZoomClick}
                tabIndex={0}
                role="button"
                aria-label="Close zoom"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setZoom(false);
                  }
                }}
              />
            )}
            {/* Backdrop for zoom */}
            {zoom && (
              <div
                className="fixed inset-0 bg-navyBlue/20 z-40"
                onClick={() => setZoom(false)}
                style={{ cursor: 'pointer' }}
              />
            )}
          </div>
        </div>
        {/* Metal Selector as colored circles */}
        <div className="flex flex-col items-center mt-3 sm:mt-4 w-full">
          <span className="text-xs sm:text-sm font-semibold mb-2 text-navyBlue">{t('chooseMetal')}</span>
          <div className="flex flex-row gap-3 sm:gap-4 justify-center">
            {ring.availableMetals.map(metal => (
              <button
                key={metal}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${selectedMetal === metal ? 'border-warmGold ring-2 ring-navyBlue' : 'border-softGray'} flex items-center justify-center transition hover:scale-110 shadow-sm`}
                style={{ backgroundColor: metalColors[metal] || '#eee' }}
                onClick={() => setSelectedMetal(metal)}
                aria-label={metalLabels[metal]}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Right: Details */}
      <div className="flex-1 flex flex-col items-start space-y-3 sm:space-y-4 min-w-0">
        {/* Breadcrumb */}
        <div className="text-xs text-navyBlue mb-1">
          {t('homeBreadcrumb')} / {t('engagementRingsBreadcrumb')} / <span className="text-charcoalGray font-semibold">{ring.designLabel}</span>
        </div>
        
        {/* Title and SKU */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-navyBlue leading-tight">{ring.designLabel} {t('diamondRing')}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-softGray">{t('sku')}: SH-XXXX</span>
            <span className="bg-softBlush text-navyBlue text-xs font-semibold px-2 py-0.5 rounded-full">{t('natural')}</span>
          </div>
        </div>
        
        {/* Price Section */}
        <div className="w-full">
          {discount ? (
            <div className="space-y-2 sm:space-y-3">
              {/* Main price display */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl xl:text-4xl font-bold text-red-600">${(currentPrice * (1 - discount.discount_percentage / 100)).toLocaleString()}</span>
                <span className="text-base sm:text-lg text-gray-500 line-through">${currentPrice.toLocaleString()}</span>
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md border border-white">
                  🔥 {discount.discount_percentage}% OFF
                </span>
              </div>
              
              {/* Discount description */}
              {discount.description && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-md px-2 py-1 sm:px-3 sm:py-1.5">
                  <div className="text-purple-700 font-semibold flex items-center gap-1 text-xs sm:text-sm">
                    <span className="text-xs sm:text-sm">✨</span>
                    {discount.description}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-warmGold">${currentPrice.toLocaleString()}</div>
          )}
        </div>
        
        {/* Description */}
        <div className="w-full">
          <p className="text-charcoalGray text-xs sm:text-sm leading-relaxed max-w-md">{ring.description}</p>
        </div>
        
        {/* Carat Selection */}
        <div className="w-full space-y-2">
          <span className="font-semibold text-navyBlue text-xs sm:text-sm">{t('caratWeight')}:</span>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {caratOptions.map(opt => (
              <button
                key={opt.value}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border text-xs font-semibold transition-colors ${
                  selectedCarat === opt.value 
                    ? 'bg-navyBlue text-white border-navyBlue shadow-sm' 
                    : 'bg-pureWhite text-navyBlue border-softGray hover:bg-navyBlue/10'
                }`}
                onClick={() => setSelectedCarat(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Button Container - Side by side */}
        <div className="flex gap-3 mt-2 sm:mt-3">
          <a 
            href={`/product/${ring.id}`} 
            className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-navyBlue text-white font-semibold rounded-full shadow-elegant hover:bg-warmGold hover:text-navyBlue transition text-xs sm:text-sm tracking-wide border border-navyBlue focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105 text-center"
          >
            {t('viewDetails')}
          </a>
          <button
            className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-warmGold text-navyBlue font-semibold rounded-full shadow-elegant hover:bg-navyBlue hover:text-white transition text-xs sm:text-sm tracking-wide border border-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105"
            onClick={() => {
              try {
                const finalPrice = discount 
                  ? currentPrice * (1 - discount.discount_percentage / 100)
                  : currentPrice;
                
                onAddToCart({
                  id: ring.id,
                  name: ring.designLabel,
                  design: ring.design,
                  designLabel: ring.designLabel,
                  metal: selectedMetal,
                  metalLabel: metalLabels[selectedMetal],
                  shape: ring.shape || ring.diamond_shape,
                  shapeLabel: ring.shape || ring.diamond_shape,
                  carat: selectedCarat,
                  price: finalPrice,
                  originalPrice: currentPrice,
                  discount: discount,
                  image: imageUrl,
                  image_url: imageUrl,
                  description: ring.description,
                  qty: 1
                });
              } catch (error) {
                console.error('Error adding to cart:', error);
                alert('There was an error adding this item to your cart. Please try again.');
              }
            }}
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 