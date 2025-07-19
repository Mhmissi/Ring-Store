import React, { useState, useRef, useEffect } from 'react';

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
  const [selectedMetal, setSelectedMetal] = useState(ring.metal);
  const [selectedCarat, setSelectedCarat] = useState('1.0');
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);
  const imageUrl = ring.images[selectedMetal] || ring.images[ring.metal] || '/placeholder-ring.png';

  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);

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
    <div className="w-full max-w-4xl bg-pureWhite rounded-lg shadow-elegant p-8 flex flex-col md:flex-row gap-8 items-start border border-navyBlue/20">
      {/* Left: Image and Metal Selector */}
      <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
        <div className="w-full flex flex-col items-center relative">
          {/* Heart Icon Button */}
          <button
            className={`absolute top-4 right-4 z-10 rounded-full p-2 bg-pureWhite/80 border border-warmGold shadow-elegant transition hover:bg-warmGold hover:text-navyBlue ${inWishlist ? 'text-red-500' : 'text-navyBlue'}`}
            onClick={toggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{ outline: 'none' }}
          >
            {inWishlist ? (
              // Filled heart
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              // Outline heart
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3c-1.74 0-3.41 0.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
              </svg>
            )}
          </button>
          <div
            ref={imageRef}
            className="w-80 h-80 mb-4 rounded shadow-elegant overflow-hidden bg-softGray relative cursor-zoom-in border border-navyBlue/10"
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
        <div className="flex flex-col items-center mt-4">
          <span className="text-sm font-semibold mb-2 text-navyBlue">Choose Metal</span>
          <div className="flex flex-row gap-4">
            {ring.availableMetals.map(metal => (
              <button
                key={metal}
                className={`w-8 h-8 rounded-full border-2 ${selectedMetal === metal ? 'border-warmGold ring-2 ring-navyBlue' : 'border-softGray'} flex items-center justify-center transition`}
                style={{ backgroundColor: metalColors[metal] || '#eee' }}
                onClick={() => setSelectedMetal(metal)}
                aria-label={metalLabels[metal]}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Right: Details */}
      <div className="flex-1 flex flex-col items-start">
        {/* Breadcrumb */}
        <div className="text-xs text-navyBlue mb-2">
          Home / ENGAGEMENT RINGS / <span className="text-charcoalGray font-semibold">{ring.designLabel}</span>
        </div>
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-navyBlue mb-2 leading-tight">{ring.designLabel} Diamond Ring</h1>
        {/* SKU and Tag */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-softGray">SKU: SH-XXXX</span>
          <span className="bg-softBlush text-navyBlue text-xs font-semibold px-2 py-1 rounded">Natural</span>
        </div>
        {/* Price */}
        <div className="text-3xl font-bold text-warmGold mb-4">${currentPrice.toLocaleString()}</div>
        {/* Description */}
        <p className="text-charcoalGray mb-4 max-w-lg">{ring.description}</p>
        {/* Metal label */}
        <div className="mb-2 text-navyBlue"><span className="font-semibold">Metal:</span> {metalLabels[selectedMetal]}</div>
        {/* Carat Selector */}
        <div className="mb-4">
          <span className="font-semibold text-navyBlue mr-2">Carat weight:</span>
          {caratOptions.map(opt => (
            <button
              key={opt.value}
              className={`inline-block px-4 py-2 rounded-full border text-sm font-semibold mr-2 mb-2 ${selectedCarat === opt.value ? 'bg-navyBlue text-white border-navyBlue' : 'bg-pureWhite text-navyBlue border-softGray hover:bg-navyBlue/10'}`}
              onClick={() => setSelectedCarat(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {/* Add to Cart */}
        <button
          className="mt-4 px-8 py-3 bg-warmGold text-navyBlue font-bold rounded-full shadow-elegant hover:bg-navyBlue hover:text-white transition text-lg tracking-wide border border-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105"
          onClick={() => onAddToCart({ ...ring, metal: selectedMetal, carat: selectedCarat, price: currentPrice })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 