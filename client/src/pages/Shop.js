import React, { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import { useCart } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

const designLabels = {
  'classic-solitaire': 'Classic Solitaire',
  'halo-setting': 'Halo Setting',
  'vintage-antique': 'Vintage/Antique',
  'three-stone': 'Three Stone',
};
const metalLabels = {
  'white-gold': 'White Gold',
  'yellow-gold': 'Yellow Gold',
  'rose-gold': 'Rose Gold',
  'platinum': 'Platinum',
};
const shapeLabels = {
  'round': 'Round',
  'princess': 'Princess',
  'emerald': 'Emerald',
  'oval': 'Oval',
};

const Shop = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    showDiscountedOnly: false,
  });
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low-high', 'price-high-low'
  const [dateSort, setDateSort] = useState('default'); // 'default', 'latest', 'oldest'
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('ring_images')
          .select('*')
          .order('design', { ascending: true })
          .order('metal', { ascending: true })
          .order('diamond_shape', { ascending: true })
          .order('carat', { ascending: true });

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

        console.log('Fetched discounts:', discountsData); // Debug log

        setProducts(productsData || []);
        setPricingData(pricingData || []);
        setDiscounts(discountsData || []);
      } catch (error) {
        setError(error.message);
        setProducts([]);
        setPricingData([]);
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ showDiscountedOnly: false });
    setSortBy('default');
    setDateSort('default');
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
    const applicableDiscounts = discounts.filter(discount => {
      const designMatch = !discount.design || discount.design === product.design;
      const metalMatch = !discount.metal || discount.metal === product.metal;
      const shapeMatch = !discount.shape || discount.shape === product.diamond_shape;
      return designMatch && metalMatch && shapeMatch;
    });
    
    // Return the highest discount percentage
    if (applicableDiscounts.length > 0) {
      return applicableDiscounts.reduce((max, discount) => 
        discount.discount_percentage > max.discount_percentage ? discount : max
      );
    }
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

  const filteredProducts = products.filter(product => {
    const hasDiscount = getDiscountForProduct(product) !== null;
    
    return (
      (!filters.showDiscountedOnly || hasDiscount)
    );
  });

  // Sort products based on price and date
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // First sort by price if specified
    if (sortBy !== 'default') {
      const priceA = getDiscountedPrice(a) || getPriceForDesignAndCarat(a.design, a.carat) || 0;
      const priceB = getDiscountedPrice(b) || getPriceForDesignAndCarat(b.design, b.carat) || 0;
      
      switch (sortBy) {
        case 'price-low-high':
          return priceA - priceB;
        case 'price-high-low':
          return priceB - priceA;
        default:
          break;
      }
    }
    
    // Then sort by date if specified
    if (dateSort !== 'default') {
      const dateA = new Date(a.created_at || a.id);
      const dateB = new Date(b.created_at || b.id);
      
      switch (dateSort) {
        case 'latest':
          return dateB - dateA; // Newest first
        case 'oldest':
          return dateA - dateB; // Oldest first
        default:
          break;
      }
    }
    
    return 0; // Keep original order
  });

  if (loading) return <div className="text-center py-12">{t('loading')}</div>;
  if (error) return <div className="text-center py-12 text-red-600">{t('error')}: {error}</div>;

  return (
  <div className="bg-pureWhite min-h-screen font-sans px-4 py-12">
    <h1 className="text-4xl font-serif font-bold text-navyBlue mb-10 text-center tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
      {t('shop')} {t('engagementRings')}
    </h1>
      {/* Sort Bar */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <select 
          className="border border-navyBlue/30 rounded px-5 py-2 text-darkGray bg-softGray focus:outline-navyBlue" 
          value={sortBy} 
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="default">{t('sortByPrice')}</option>
          <option value="price-low-high">{t('priceLowHigh')}</option>
          <option value="price-high-low">{t('priceHighLow')}</option>
        </select>
        <select 
          className="border border-navyBlue/30 rounded px-5 py-2 text-darkGray bg-softGray focus:outline-navyBlue" 
          value={dateSort} 
          onChange={e => setDateSort(e.target.value)}
        >
          <option value="default">{t('sortByDate')}</option>
          <option value="latest">{t('latest')}</option>
          <option value="oldest">{t('oldest')}</option>
        </select>
        <button className="px-5 py-2 bg-navyBlue text-white font-bold rounded border border-navyBlue hover:bg-warmGold hover:text-navyBlue transition" onClick={clearFilters}>
          {t('clearFilters')}
        </button>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={filters.showDiscountedOnly}
            onChange={e => handleFilterChange('showDiscountedOnly', e.target.checked)}
          />
          <span className="text-purple-700 font-medium">
            {t('showDiscountedOnly')}
          </span>
        </label>
    </div>
      <div className="w-full border-t border-lightGray my-8" />
      
    {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {sortedProducts.length === 0 ? (
          <div className="col-span-full text-center text-mediumGray py-12">{t('noProductsFound')}</div>
        ) : sortedProducts.map((product) => {
          const imageUrl = product.public_url || (product.image_url
            ? supabase.storage.from('ring-images').getPublicUrl(product.image_url).data.publicUrl
            : '/placeholder-ring.png');
          const price = getPriceForDesignAndCarat(product.design, product.carat);
          const discount = getDiscountForProduct(product);
          const discountedPrice = discount ? getDiscountedPrice(product) : price;
          
          // Debug logging
          console.log('Product:', product.design, 'Price:', price, 'Discount:', discount, 'Discounted Price:', discountedPrice);
          
          return (
        <div key={product.id} className="bg-softGray rounded-2xl shadow-elegant border border-navyBlue/20 hover:border-navyBlue transition-all duration-300 flex flex-col items-center group overflow-hidden relative">
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount.discount_percentage}% OFF
            </div>
          )}
          
          <img 
            src={imageUrl} 
            alt={`${product.design} Ring`}
            className="w-full h-56 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="p-4 w-full">
            <h3 className="text-lg font-bold text-navyBlue mb-2">{product.design}</h3>
            <p className="text-darkGray text-sm mb-2">{product.metal} • {product.diamond_shape} • {product.carat} ct</p>
            
            {/* Price Display - Show both old and new prices side by side */}
            <div className="mb-3">
              {discount && discountedPrice ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-600">${Math.round(discountedPrice).toLocaleString()}</span>
                    <span className="text-gray-500 text-sm line-through">
                      ${Math.round(price).toLocaleString()}
                    </span>
                  </div>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {discount.discount_percentage}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-warmGold">${price ? Math.round(price).toLocaleString() : 'Price on request'}</span>
              )}
            </div>
            
            {/* Button Container - Side by side */}
            <div className="flex gap-2 mt-3">
              <a href={`/product/${product.id}`} className="flex-1 px-3 py-1.5 bg-navyBlue text-white font-semibold rounded-full shadow-elegant hover:bg-warmGold hover:text-navyBlue transition-all duration-200 text-xs tracking-wide border border-navyBlue focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105 text-center">
                {t('viewDetails')}
              </a>
              <button
                className="flex-1 px-3 py-1.5 bg-warmGold text-navyBlue font-semibold rounded-full shadow-elegant hover:bg-navyBlue hover:text-white transition-all duration-200 text-xs tracking-wide border border-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105"
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: designLabels[product.design] || product.design,
                    design: product.design,
                    designLabel: designLabels[product.design] || product.design,
                    metal: product.metal,
                    metalLabel: metalLabels[product.metal] || product.metal,
                    shape: product.diamond_shape,
                    shapeLabel: shapeLabels[product.diamond_shape] || product.diamond_shape,
                    carat: product.carat,
                    price: discountedPrice || price,
                    originalPrice: price,
                    discount: discount,
                    image: imageUrl,
                    qty: 1
                  });
                  setAddedId(product.id);
                  setTimeout(() => setAddedId(null), 1000);
                }}
                disabled={!price}
              >
                {addedId === product.id ? t('added') : (
                  <span className="flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385m-.383-7.822L6.75 7.5m0 0h10.5m-10.5 0l1.7 6.385m0 0A2.25 2.25 0 0010.125 16.5h3.75a2.25 2.25 0 002.175-1.615l1.7-6.385m-10.5 0h10.5" />
                    </svg>
                    <span>{t('addToCart')}</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
          );
        })}
    </div>
    
    {/* View All Products Button - Only shows when discount filter is active */}
    {filters.showDiscountedOnly && (
      <div className="flex justify-center mt-8">
                  <button 
            className="px-8 py-3 bg-warmGold text-navyBlue font-bold rounded-full shadow-elegant hover:bg-navyBlue hover:text-white transition-all duration-200 text-lg tracking-wide border border-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105"
            onClick={() => handleFilterChange('showDiscountedOnly', false)}
          >
            {t('viewAllProducts')}
          </button>
      </div>
    )}
    
    <style>{`
      .text-navyBlue { color: #2c3e50; }
      .border-navyBlue { border-color: #2c3e50; }
      .bg-navyBlue { background-color: #2c3e50; }
      .text-warmGold { color: #f39c12; }
      .border-warmGold { border-color: #f39c12; }
      .bg-warmGold { background-color: #f39c12; }
      .text-darkGray { color: #555555; }
      .bg-pureWhite { background-color: #ffffff; }
      .border-lightGray { border-color: #e0e0e0; }
      .shadow-elegant { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    `}</style>
  </div>
);
};

export default Shop; 