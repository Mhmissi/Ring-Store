import React from "react";
import { useCart } from "../App";
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Cart = () => {
  const { t } = useLanguage();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const shipping = cart.length > 0 ? 50 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="bg-pureWhite min-h-screen flex items-center justify-center py-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-softGray rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-navyBlue" />
          </div>
          <h1 className="text-2xl font-bold text-navyBlue mb-4">{t('emptyCart')}</h1>
          <p className="text-darkGray mb-6">Add some beautiful rings to get started!</p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-navyBlue text-white font-bold rounded-full px-8 py-3 shadow-elegant hover:bg-warmGold hover:text-navyBlue transition"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pureWhite min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center text-navyBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
          {t('cart')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-softGray rounded-xl shadow-elegant border border-navyBlue/10 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-pureWhite rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-navyBlue/10">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.design_label} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-warmGold text-2xl">💍</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navyBlue text-lg mb-1">
                      {item.design_label}
                    </h3>
                    <p className="text-darkGray text-sm mb-2">
                      {item.metal_label} • {item.shape_label} • {item.carat}ct
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.qty || 1) - 1)}
                        className="w-8 h-8 rounded-full border border-lightGray flex items-center justify-center hover:bg-navyBlue/10"
                      >
                        <Minus className="w-4 h-4 text-navyBlue" />
                      </button>
                      <span className="w-12 text-center font-semibold text-navyBlue">{item.qty || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.qty || 1) + 1)}
                        className="w-8 h-8 rounded-full border border-lightGray flex items-center justify-center hover:bg-navyBlue/10"
                      >
                        <Plus className="w-4 h-4 text-navyBlue" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-warmGold text-lg">${((item.price || 0) * (item.qty || 1)).toLocaleString()}</p>
                    <p className="text-darkGray text-sm">${(item.price || 0).toLocaleString()} each</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-red-500 hover:text-red-700 flex items-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-pureWhite rounded-xl shadow-elegant border border-navyBlue/10 p-6">
              <h2 className="text-xl font-bold text-navyBlue mb-4">{t('orderSummary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-darkGray">
                  <span>{t('subtotal')} ({cart.length} {t('items')})</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-darkGray">
                  <span>{t('shipping')}</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-darkGray">
                  <span>{t('tax')}</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-lightGray pt-3">
                  <div className="flex justify-between text-lg font-bold text-navyBlue">
                    <span>{t('total')}</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-navyBlue text-white font-bold rounded-full py-4 shadow-elegant hover:bg-warmGold hover:text-navyBlue transition-all duration-200"
              >
                {t('proceedToCheckout')}
              </button>
              
              <button 
                onClick={() => navigate('/shop')}
                className="w-full bg-pureWhite text-navyBlue font-bold rounded-full py-3 border border-navyBlue hover:bg-navyBlue/10 transition mt-3"
              >
                {t('continueShopping')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 