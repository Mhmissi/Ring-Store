import React, { useEffect, useState } from "react";
import { useCart } from "../App";
import { ringOptions, basePrice } from "../data/ringOptions";

const Wishlist = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    setWishlist(stored ? JSON.parse(stored) : []);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addProductToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    alert("Added to cart!");
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brilliantBlue mb-4">Your Wishlist is Empty</h1>
          <a href="/shop" className="text-brilliantBlue font-bold hover:underline">Shop Rings</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
        My Wishlist
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {wishlist.map(item => (
          <div key={item.id} className="bg-platinumSilver rounded-lg shadow-elegant p-6 border border-brilliantBlue/20 flex flex-col items-center">
            <img src={process.env.PUBLIC_URL + '/ringstestimages/halo seting gold ring.jpg'} alt="Wishlist Ring" className="w-20 h-20 object-cover rounded-full border-2 border-brilliantBlue/10" />
            <div className="font-serif text-lg font-bold mb-1 text-center text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>{item.name}</div>
            <div className="text-champagneGold text-base mb-3 font-semibold">{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            <div className="flex gap-2">
              <button className="bg-brilliantBlue text-white font-bold rounded shadow-elegant hover:bg-champagneGold hover:text-black transition text-sm tracking-wide border border-brilliantBlue px-6 py-2 mt-2" onClick={() => addProductToCart(item)}>Add to Cart</button>
              <button className="px-4 py-2 bg-diamondWhite border border-champagneGold text-brilliantBlue rounded font-bold hover:bg-champagneGold hover:text-black transition" onClick={() => removeFromWishlist(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist; 