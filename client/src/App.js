import React, { useState, useEffect, useContext, createContext, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RingCustomizer from './components/RingCustomizer';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import './index.css';
import AdminLogin from './pages/AdminLogin';
import ChangePassword from './components/ChangePassword';
import AuthPage from './pages/AuthPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

import { supabase } from './lib/supabase';

// Lazy load components for better performance
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Account = lazy(() => import('./pages/Account'));



const CartCount = () => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  
  if (totalItems === 0) return null;
  
  return (
    <span className="absolute -top-2 -right-2 bg-warmGold text-navyBlue text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {totalItems}
    </span>
  );
};

const Header = () => {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  return (
    <header className="bg-gradient-to-br from-pureWhite via-softGray to-navyBlue/5 shadow-elegant sticky top-0 z-50 backdrop-blur-md border-b-2 border-navyBlue/10">
      {/* Mobile Menu Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center space-x-2 text-2xl font-extrabold text-navyBlue tracking-wide font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
          <img src="/ringstestimages/diamond.png" alt="Diamond Logo" className="w-8 h-8" />
          <span>Grown Lab Diamond</span>
        </a>
        <button className="md:hidden text-navyBlue focus:outline-none" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <ul className={`flex-col md:flex-row md:flex gap-0 md:gap-8 items-center font-semibold text-darkGray text-lg font-sans transition-all duration-300 ${open ? 'flex absolute top-20 left-0 w-full bg-pureWhite py-6 z-40 border-t-2 border-navyBlue/10 shadow-lg' : 'hidden md:flex'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* Main Navigation */}
          <li className="w-full md:w-auto"><a href="/" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-navyBlue transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded">{t('home')}</a></li>
          <li className="w-full md:w-auto"><a href="/shop" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-navyBlue transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded">{t('shop')}</a></li>
          <li className="w-full md:w-auto"><a href="/customize" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-navyBlue transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded">{t('customize')}</a></li>
          <li className="w-full md:w-auto"><a href="/wishlist" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-navyBlue transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded">{t('wishlist')}</a></li>
          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-navyBlue/20"></div>
          {/* User Actions */}
          <li className="w-full md:w-auto"><a href="/auth" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-warmGold transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded">{t('login')}</a></li>
          <li className="w-full md:w-auto">
            <a href="/account" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-warmGold transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto md:mx-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </li>
          <li className="w-full md:w-auto">
            <a href="/cart" onClick={() => setOpen(false)} className="block w-full text-center md:text-left hover:text-warmGold transition-colors duration-200 px-4 py-3 md:px-2 md:py-1 rounded relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto md:mx-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385m-.383-7.822L6.75 7.5m0 0h10.5m-10.5 0l1.7 6.385m0 0A2.25 2.25 0 0010.125 16.5h3.75a2.25 2.25 0 002.175-1.615l1.7-6.385m-10.5 0h10.5" />
              </svg>
              <CartCount />
            </a>
          </li>
          {/* Language Switcher */}
          <li className="w-full md:w-auto flex justify-center md:justify-start">
            <LanguageSwitcher />
          </li>
        </ul>
      </nav>
      <style>{`
        /* Primary Colors - Inspired by MoissaniteCo */
        .text-navyBlue { color: #1a365d; }
        .hover:text-navyBlue:hover { color: #1a365d; }
        .bg-navyBlue { background-color: #1a365d; }
        .border-navyBlue { border-color: #1a365d; }
        
        /* Accent Colors */
        .text-warmGold { color: #d69e2e; }
        .hover:text-warmGold:hover { color: #d69e2e; }
        .bg-warmGold { background-color: #d69e2e; }
        .border-warmGold { border-color: #d69e2e; }
        
        /* Rose Gold Accent */
        .text-roseGold { color: #e53e3e; }
        .hover:text-roseGold:hover { color: #e53e3e; }
        .bg-roseGold { background-color: #e53e3e; }
        .border-roseGold { border-color: #e53e3e; }
        
        /* Background Colors */
        .bg-pureWhite { background-color: #ffffff; }
        .bg-softGray { background-color: #f7fafc; }
        .bg-lightGray { background-color: #edf2f7; }
        
        /* Text Colors */
        .text-darkGray { color: #2d3748; }
        .text-mediumGray { color: #4a5568; }
        .text-lightGray { color: #718096; }
        
        /* Legacy support - keeping old names for compatibility */
        .text-brilliantBlue { color: #1a365d; }
        .hover:text-brilliantBlue:hover { color: #1a365d; }
        .bg-brilliantBlue { background-color: #1a365d; }
        .bg-diamondWhite { background-color: #ffffff; }
        .bg-platinumSilver { background-color: #f7fafc; }
        .text-charcoalGray { color: #2d3748; }
        .hover:text-champagneGold:hover { color: #d69e2e; }
        .bg-champagneGold { background-color: #d69e2e; }
        .border-brilliantBlue { border-color: #1a365d; }
        .border-champagneGold { border-color: #d69e2e; }
        
        /* Enhanced Shadows */
        .shadow-elegant { box-shadow: 0 10px 25px -5px rgba(26, 54, 93, 0.1), 0 10px 10px -5px rgba(26, 54, 93, 0.04); }
        .shadow-gold { box-shadow: 0 4px 6px -1px rgba(214, 158, 46, 0.1), 0 2px 4px -1px rgba(214, 158, 46, 0.06); }
      `}</style>
    </header>
  );
};

// Cart Context
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Listen for auth changes
  useEffect(() => {
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cart from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const loadCart = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading cart:', error);
          return;
        }

        setCart(data || []);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      const isCustom = product.id && product.id.startsWith('custom-');
      // Check if item already exists in cart (custom: match by id, regular: match by product_id)
      let existingItem;
      if (isCustom) {
        const { data } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('design', product.design)
          .eq('metal', product.metal)
          .eq('shape', product.shape)
          .eq('carat', product.carat)
          .single();
        existingItem = data;
      } else {
        const { data } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single();
        existingItem = data;
      }

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ qty: existingItem.qty + 1 })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;

        setCart(prev => prev.map(item => 
          item.id === existingItem.id ? { ...item, qty: item.qty + 1 } : item
        ));
      } else {
        // Add new item
        const insertObj = {
          user_id: user.id,
          design: product.design,
          design_label: product.designLabel || product.name,
          metal: product.metal,
          metal_label: product.metalLabel || product.metal,
          shape: product.shape,
          shape_label: product.shapeLabel || product.shape,
          carat: product.carat,
          price: product.price,
          image_url: product.image,
          qty: 1
        };
        if (!isCustom) {
          insertObj.product_id = product.id;
        }
        const { data, error } = await supabase
          .from('cart_items')
          .insert(insertObj)
          .select()
          .single();

        if (error) throw error;

        setCart(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart');
    }
  };

  const removeFromCart = async (id) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCart(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart');
    }
  };

  const updateQuantity = async (id, qty) => {
    if (!user) return;

    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ qty })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, qty } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error clearing cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Luxury Footer
const Footer = () => {
  const { t } = useLanguage();
  return (
  <footer className="bg-gradient-to-br from-pureWhite via-softGray to-navyBlue/10 text-navyBlue pt-12 pb-6 px-4 mt-16 border-t border-navyBlue/20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <img src="/ringstestimages/diamond.png" alt="Diamond Logo" className="w-8 h-8" />
          <h3 className="font-serif text-2xl font-bold text-navyBlue" style={{ fontFamily: 'Playfair Display, serif' }}>Grown Lab Diamond</h3>
        </div>
        <p className="text-darkGray mb-4">{t('exquisiteLabGrown')}</p>
        <div className="flex gap-4 mt-2">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-warmGold transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-warmGold transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 2.1c-3.9 0-7 3.1-7 7v2H7v3h3v7h3v-7h2.1l.4-3H13V9c0-1.1.9-2 2-2h2V4.1c0-1.1-.9-2-2-2z"/></svg></a>
          <a href="mailto:info@grownlabdiamond.com" className="hover:text-warmGold transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.29 7.3a1 1 0 0 1-1.42 0L4 6.41V20h16V6.41z"/></svg></a>
        </div>
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold mb-2 text-navyBlue">{t('links')}</h4>
        <ul className="space-y-2">
          <li><a href="/shop" className="hover:text-warmGold transition">{t('shop')}</a></li>
          <li><a href="/customize" className="hover:text-warmGold transition">{t('customize')}</a></li>
          <li><a href="/wishlist" className="hover:text-warmGold transition">{t('wishlist')}</a></li>
          <li><a href="/account" className="hover:text-warmGold transition">{t('account')}</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold mb-2 text-navyBlue">{t('contact')}</h4>
        <p className="text-darkGray">Koningin Astridplein 31</p>
        <p className="text-darkGray">2010 Antwerpen, Belgium</p>
        <p className="text-darkGray">info@grownlabdiamond.com</p>
        <p className="text-darkGray">+32 490 25 90 05</p>
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold mb-2 text-navyBlue">{t('newsletter')}</h4>
        <form className="flex flex-col gap-2">
          <input type="email" placeholder={t('yourEmail')} className="rounded-full px-4 py-2 bg-white/10 border border-navyBlue/40 text-navyBlue placeholder:text-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40" />
          <button type="submit" className="bg-navyBlue text-white font-bold rounded-full px-4 py-2 mt-1 shadow-elegant hover:bg-warmGold hover:text-navyBlue transition-all duration-200 border border-warmGold focus:outline-none focus:ring-2 focus:ring-navyBlue/40">{t('subscribe')}</button>
        </form>
      </div>
    </div>
    <div className="text-center text-darkGray text-xs mt-10">&copy; {new Date().getFullYear()} Grown Lab Diamond. {t('allRightsReserved')}</div>
  </footer>
  );
};

const ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS ? 
  process.env.REACT_APP_ADMIN_EMAILS.split(',') : 
  ['user123@gmail.com'];

function AdminRoute() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <AdminLogin onLogin={() => window.location.reload()} />;
  if (!ADMIN_EMAILS.includes(user.email)) return <div>Access denied</div>;
  return <AdminPanel ChangePassword={ChangePassword} />;
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <Header />
            <main className="min-h-screen bg-white font-sans">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/customize" element={<RingCustomizer />} />

                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/admin" element={<AdminRoute />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </Router>
        </CartProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App; 