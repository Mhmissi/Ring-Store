import React, { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';
import { useCart } from '../App';

const designOptions = [
  '', 'classic-solitaire', 'halo-setting', 'vintage-antique', 'three-stone'
];
const metalOptions = [
  '', 'white-gold', 'yellow-gold', 'rose-gold', 'platinum'
];
const shapeOptions = [
  '', 'round', 'princess', 'emerald', 'oval'
];
const caratOptions = [
  '', '1.0', '1.5', '2.0', '2.5'
];

const designLabels = {
  '': 'All Designs',
  'classic-solitaire': 'Classic Solitaire',
  'halo-setting': 'Halo Setting',
  'vintage-antique': 'Vintage/Antique',
  'three-stone': 'Three Stone',
};
const metalLabels = {
  '': 'All Metals',
  'white-gold': 'White Gold',
  'yellow-gold': 'Yellow Gold',
  'rose-gold': 'Rose Gold',
  'platinum': 'Platinum',
};
const shapeLabels = {
  '': 'All Shapes',
  'round': 'Round',
  'princess': 'Princess',
  'emerald': 'Emerald',
  'oval': 'Oval',
};
const caratLabels = {
  '': 'All Carats',
  '1.0': '1.0 ct',
  '1.5': '1.5 ct',
  '2.0': '2.0 ct',
  '2.5': '2.5 ct',
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    design: '',
    metal: '',
    shape: '',
    carat: '',
  });
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

        setProducts(productsData || []);
        setPricingData(pricingData || []);
      } catch (error) {
        setError(error.message);
        setProducts([]);
        setPricingData([]);
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
    setFilters({ design: '', metal: '', shape: '', carat: '' });
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

  const filteredProducts = products.filter(product => {
    return (
      (!filters.design || product.design === filters.design) &&
      (!filters.metal || product.metal === filters.metal) &&
      (!filters.shape || product.diamond_shape === filters.shape) &&
      (!filters.carat || (product.carat && product.carat.toString() === filters.carat))
    );
  });

  if (loading) return <div className="text-center py-12">Loading products...</div>;
  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
  <div className="bg-pureWhite min-h-screen font-sans px-4 py-12">
    <h1 className="text-4xl font-serif font-bold text-navyBlue mb-10 text-center tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
      Shop All Rings
    </h1>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <select className="border border-navyBlue/30 rounded px-5 py-2 text-darkGray bg-softGray focus:outline-navyBlue" value={filters.design} onChange={e => handleFilterChange('design', e.target.value)}>
          {designOptions.map(opt => <option key={opt} value={opt}>{designLabels[opt]}</option>)}
        </select>
        <select className="border border-navyBlue/30 rounded px-5 py-2 text-darkGray bg-softGray focus:outline-navyBlue" value={filters.metal} onChange={e => handleFilterChange('metal', e.target.value)}>
          {metalOptions.map(opt => <option key={opt} value={opt}>{metalLabels[opt]}</option>)}
      </select>
        <select className="border border-navyBlue/30 rounded px-5 py-2 text-darkGray bg-softGray focus:outline-navyBlue" value={filters.shape} onChange={e => handleFilterChange('shape', e.target.value)}>
          {shapeOptions.map(opt => <option key={opt} value={opt}>{shapeLabels[opt]}</option>)}
      </select>
        <select className="border border-navyBlue/30 rounded px-5 py-2 text-darkGray bg-softGray focus:outline-navyBlue" value={filters.carat} onChange={e => handleFilterChange('carat', e.target.value)}>
          {caratOptions.map(opt => <option key={opt} value={opt}>{caratLabels[opt]}</option>)}
      </select>
        <button className="px-5 py-2 bg-navyBlue text-white font-bold rounded border border-navyBlue hover:bg-warmGold hover:text-navyBlue transition" onClick={clearFilters}>
          Clear Filters
        </button>
    </div>
      <div className="w-full border-t border-lightGray my-8" />
    {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-mediumGray py-12">No products found for selected filters.</div>
        ) : filteredProducts.map((product) => {
          const imageUrl = product.public_url || (product.image_url
            ? supabase.storage.from('ring-images').getPublicUrl(product.image_url).data.publicUrl
            : '/placeholder-ring.png');
          const price = getPriceForDesignAndCarat(product.design, product.carat);
          return (
        <div key={product.id} className="bg-softGray rounded-2xl shadow-elegant border border-navyBlue/20 hover:border-navyBlue transition-all duration-300 flex flex-col items-center group overflow-hidden relative">
          <div className="w-full h-56 flex items-center justify-center overflow-hidden rounded-t-2xl bg-pureWhite">
                <img src={imageUrl} alt={product.design} className="w-full h-full object-cover transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300 ease-in-out" onError={e => { e.target.src = '/placeholder-ring.png'; }} />
          </div>
          <div className="p-5 w-full flex flex-col items-center">
                <div className="font-serif text-lg font-bold mb-1 text-center text-navyBlue" style={{ fontFamily: 'Playfair Display, serif' }}>{designLabels[product.design] || product.design}</div>
                <div className="text-darkGray text-sm mb-1">{metalLabels[product.metal] || product.metal} • {shapeLabels[product.diamond_shape] || product.diamond_shape} • {product.carat ? `${product.carat} ct` : ''}</div>
                <div className="text-warmGold text-base mb-3 font-semibold">{price ? `$${price.toLocaleString()}` : 'Price on request'}</div>
            <a href={`/product/${product.id}`} className="inline-block mt-auto px-6 py-2 bg-navyBlue text-white font-bold rounded-full shadow-elegant hover:bg-warmGold hover:text-navyBlue transition-all duration-200 text-sm tracking-wide border border-navyBlue focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105">
              View Details
            </a>
            <button
              className="mt-2 px-6 py-2 bg-warmGold text-navyBlue font-bold rounded-full shadow-elegant hover:bg-navyBlue hover:text-white transition-all duration-200 text-sm tracking-wide border border-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40 hover:scale-105"
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
                  price: price,
                  image: imageUrl,
                  qty: 1
                });
                setAddedId(product.id);
                setTimeout(() => setAddedId(null), 1000);
              }}
              disabled={!price}
            >
              {addedId === product.id ? 'Added!' : (
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385m-.383-7.822L6.75 7.5m0 0h10.5m-10.5 0l1.7 6.385m0 0A2.25 2.25 0 0010.125 16.5h3.75a2.25 2.25 0 002.175-1.615l1.7-6.385m-10.5 0h10.5" />
                  </svg>
                  <span>Add to Cart</span>
                </span>
              )}
            </button>
          </div>
        </div>
          );
        })}
    </div>
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