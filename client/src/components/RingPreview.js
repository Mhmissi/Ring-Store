import React from 'react';
import { Loader2, Heart, ShoppingCart, Eye, Sparkles, Info, Diamond, Crown, Star } from 'lucide-react';

const RingPreview = ({ imageUrl, loading, description }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={imageUrl}
        alt={description || 'Ring preview'}
        className="object-contain w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default RingPreview; 