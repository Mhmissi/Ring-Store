import React, { useState, useEffect } from "react";
import { useCart } from "../App";
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Shield, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    saveInfo: false
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = cart.length > 0 ? 50 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth?redirect=checkout');
        return;
      }
      setUser(session.user);
      
      // Pre-fill form with user data if available
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setForm(prev => ({
          ...prev,
          firstName: profile.name?.split(' ')[0] || '',
          lastName: profile.name?.split(' ').slice(1).join(' ') || '',
          email: session.user.email,
          phone: profile.phone || '',
          address: profile.address || ''
        }));
      } else {
        setForm(prev => ({
          ...prev,
          email: session.user.email
        }));
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields (skip card fields for testing)
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    // (Skip cardNumber, cardName, expiryMonth, expiryYear, cvv)
    
    // Email validation
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (form.phone && !/^\+?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processOrder = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: cart.map(item => ({
            product: `${item.designLabel || item.design_label || item.name || 'Custom Ring'} - ${item.metalLabel || item.metal_label || item.metal || 'N/A'} - ${item.carat || 'N/A'}ct`,
            qty: item.qty,
            price: item.price,
            product_id: item.product_id || (!item.id || (item.id && item.id.startsWith('custom-')) ? null : item.id)
          })),
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: 'pending',
          shipping_address: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
            phone: form.phone
          },
          payment_info: {
            cardLast4: '0000',
            cardType: 'test'
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Update user profile if saveInfo is checked
      if (form.saveInfo) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: `${form.firstName} ${form.lastName}`,
            address: form.address,
            phone: form.phone
          });
      }

      // Clear cart
    setCart([]);
      
      // Set order complete
      // setOrderId(order.id); // This line was removed as per the edit hint
      setOrderComplete(true);
      
    } catch (error) {
      console.error('Order processing error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some beautiful rings to your cart first!</p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-gold text-black font-bold rounded-full px-8 py-3 shadow hover:bg-black hover:text-gold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="bg-diamondWhite min-h-screen flex items-center justify-center py-10">
        <div className="bg-platinumSilver rounded-xl shadow-elegant p-8 max-w-lg w-full text-center border border-brilliantBlue/10">
          <CheckCircle className="w-16 h-16 text-brilliantBlue mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brilliantBlue mb-2">Thank you for your order!</h1>
          <p className="text-charcoalGray mb-4">Your order has been placed successfully. We will contact you soon with shipping details.</p>
          <button onClick={() => navigate('/shop')} className="bg-brilliantBlue text-white font-bold rounded-full px-8 py-3 shadow-elegant hover:bg-champagneGold hover:text-black transition">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-diamondWhite min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
          Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form className="lg:col-span-2 space-y-6 bg-platinumSilver rounded-xl shadow-elegant p-8 border border-brilliantBlue/10">
            {/* Shipping Information */}
            <div className="bg-diamondWhite rounded-xl shadow-elegant border border-brilliantBlue/10 p-6">
              <h2 className="text-xl font-bold text-brilliantBlue mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brilliantBlue" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.firstName ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.lastName ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoalGray mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                    errors.email ? 'border-red-300' : 'border-brilliantBlue/30'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoalGray mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                    errors.phone ? 'border-red-300' : 'border-brilliantBlue/30'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoalGray mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                    errors.address ? 'border-red-300' : 'border-brilliantBlue/30'
                  }`}
                  placeholder="123 Gold Street"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.city ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.state ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                    placeholder="NY"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.postalCode ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                    placeholder="10001"
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-diamondWhite rounded-xl shadow-elegant border border-brilliantBlue/10 p-6">
              <h2 className="text-xl font-bold text-brilliantBlue mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-brilliantBlue" />
                Payment Information
              </h2>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoalGray mb-1">Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setForm(prev => ({ ...prev, cardNumber: formatted }));
                    if (errors.cardNumber) {
                      setErrors(prev => ({ ...prev, cardNumber: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                    errors.cardNumber ? 'border-red-300' : 'border-brilliantBlue/30'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoalGray mb-1">Cardholder Name *</label>
                <input
                  type="text"
                  name="cardName"
                  value={form.cardName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                    errors.cardName ? 'border-red-300' : 'border-brilliantBlue/30'
                  }`}
                  placeholder="JOHN DOE"
                />
                {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">Expiry Month *</label>
                  <select
                    name="expiryMonth"
                    value={form.expiryMonth}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.expiryMonth ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                </div>
        <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">Expiry Year *</label>
                  <select
                    name="expiryYear"
                    value={form.expiryYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.expiryYear ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
        </div>
        <div>
                  <label className="block text-sm font-medium text-charcoalGray mb-1">CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 ${
                      errors.cvv ? 'border-red-300' : 'border-brilliantBlue/30'
                    }`}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={form.saveInfo}
                  onChange={handleChange}
                  className="w-4 h-4 text-brilliantBlue border-brilliantBlue/30 rounded focus:ring-brilliantBlue"
                />
                <label className="ml-2 text-sm text-charcoalGray">
                  Save shipping information for future orders
                </label>
              </div>
            </div>
          </form>
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-diamondWhite rounded-xl shadow-elegant border border-brilliantBlue/10 p-6">
              <h2 className="text-xl font-bold text-brilliantBlue mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-brilliantBlue/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-brilliantBlue/10 rounded-lg flex items-center justify-center">
                        <span className="text-brilliantBlue text-lg">💍</span>
        </div>
        <div>
                        <p className="font-semibold text-charcoalGray">{item.designLabel || item.name}</p>
                        <p className="text-sm text-charcoalGray">
                          {item.metal && `${item.metal} • `}{item.carat && `${item.carat}ct`}
                        </p>
                        <p className="text-xs text-charcoalGray">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-charcoalGray">${(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-brilliantBlue/10 pt-4">
                <div className="flex justify-between text-charcoalGray">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoalGray">
                  <span>Shipping</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoalGray">
                  <span>Tax</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-brilliantBlue/10 pt-3">
                  <div className="flex justify-between text-lg font-bold text-brilliantBlue">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-brilliantBlue/10 rounded-xl border border-brilliantBlue/20 p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-brilliantBlue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brilliantBlue mb-1">Secure Checkout</h3>
                  <p className="text-sm text-brilliantBlue">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              onClick={processOrder}
              disabled={processing}
              className="w-full bg-brilliantBlue text-white font-bold rounded-full py-4 shadow-elegant hover:bg-champagneGold hover:text-black transition-all duration-200 disabled:opacity-60"
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>

            {/* Return to Cart */}
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full bg-diamondWhite text-brilliantBlue font-bold rounded-full py-3 border border-brilliantBlue hover:bg-brilliantBlue/10 transition mt-3"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 