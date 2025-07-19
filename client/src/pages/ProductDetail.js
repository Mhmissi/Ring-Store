import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ringOptions, basePrice } from "../data/ringOptions";
import { useCart } from '../App';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const getDesignLabel = (value) => {
  const found = [
    ...((ringOptions && ringOptions.designs) || []),
    { id: 'classic-solitaire', name: 'Classic Solitaire' },
    { id: 'halo-setting', name: 'Halo Setting' },
    { id: 'vintage-antique', name: 'Vintage/Antique Style' },
    { id: 'three-stone', name: 'Three Stone' },
  ].find(d => d.id === value || d.value === value);
  return found ? found.name : value;
};
const getDescription = (value) => {
  const found = [
    ...((ringOptions && ringOptions.designs) || []),
    { id: 'classic-solitaire', description: 'A timeless single stone setting, perfect for any occasion.' },
    { id: 'halo-setting', description: 'Diamond surrounded by smaller stones for extra brilliance.' },
    { id: 'vintage-antique', description: 'Romantic, art-deco inspired design for a unique look.' },
    { id: 'three-stone', description: 'Past, present, and future symbolism in a trinity design.' },
  ].find(d => d.id === value || d.value === value);
  return found ? found.description : '';
};
const allMetals = ["white-gold", "yellow-gold", "rose-gold", "platinum"];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      // Fetch the product by id
      const { data, error } = await supabase
        .from('ring_images')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        setError('Product Not Found');
        setProduct(null);
        setLoading(false);
        return;
      }
      // Find all images for this design/shape (for all metals)
      const { data: allImages } = await supabase
        .from('ring_images')
        .select('*')
        .eq('design', data.design)
        .eq('diamond_shape', data.diamond_shape);
      // Build images by metal
      const images = {};
      allMetals.forEach(metal => {
        const found = (allImages || []).find(img => img.metal === metal);
        if (found) {
          images[metal] = found.image_url ? supabase.storage.from('ring-images').getPublicUrl(found.image_url).data.publicUrl : '/placeholder-ring.png';
        }
      });
      // Fetch pricing data for this design
      const { data: pricingData } = await supabase
        .from('ring_pricing')
        .select('*')
        .eq('design', data.design)
        .single();
      // Prepare product data for ProductCard
      setProduct({
        id: data.id,
        design: data.design,
        designLabel: getDesignLabel(data.design),
        description: getDescription(data.design),
        metal: data.metal,
        availableMetals: allMetals.filter(metal => images[metal]),
        images,
        price: pricingData?.price_1_0ct || basePrice, // Default to 1.0ct price
        priceData: pricingData ? {
          price_1_0ct: pricingData.price_1_0ct,
          price_1_5ct: pricingData.price_1_5ct,
          price_2_0ct: pricingData.price_2_0ct,
          price_2_5ct: pricingData.price_2_5ct
        } : null
      });
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  if (error || !product) {
    return (
      <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brilliantBlue mb-4">Product Not Found</h1>
          <a href="/shop" className="text-brilliantBlue font-bold hover:underline">Back to Shop</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12 flex items-center justify-center">
      <ProductCard ring={product} onAddToCart={addToCart} />
    </div>
  );
};

export default ProductDetail; 