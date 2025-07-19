import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RingCustomizer from './components/RingCustomizer';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import './index.css';
import AdminLogin from './pages/AdminLogin';
import ChangePassword from './components/ChangePassword';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AuthPage from './pages/AuthPage';
import Contact from './pages/Contact';
import About from './pages/About';

// Placeholder pages
const featuredProducts = [
  {
    id: 1,
    name: 'Classic Solitaire',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    price: 1200
  },
  {
    id: 2,
    name: 'Halo Setting',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    price: 1850
  },
  {
    id: 3,
    name: 'Three Stone',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    price: 2100
  }
];

const TEAM = [
  {
    name: "Avi Shemesh",
    title: "Founder & Master Jeweler",
    funFact: "Handcrafts every prototype himself.",
    img: null, // Add image path if available
  },
  {
    name: "Leah Gold",
    title: "Customer Experience Lead",
    funFact: "Loves matching rings to stories.",
    img: null,
  },
];

const VALUES = [
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.657-1.343-3-3-3z" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Ethical Sourcing",
    desc: "Responsibly sourced materials for peace of mind."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Craftsmanship",
    desc: "Every ring is meticulously handcrafted."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Personal Service",
    desc: "Guidance at every step of your journey."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
    ),
    title: "Celebrating Love",
    desc: "Jewelry for life's most meaningful moments."
  },
];

const CartCount = () => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  
  if (totalItems === 0) return null;
  
  return (
    <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {totalItems}
    </span>
  );
};

const Header = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="bg-gradient-to-br from-diamondWhite via-platinumSilver to-brilliantBlue/10 shadow-elegant sticky top-0 z-50 backdrop-blur-md border-b-2 border-brilliantBlue/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="text-2xl font-extrabold text-brilliantBlue tracking-wide font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>Shemesh Gold</a>
        <button className="md:hidden text-brilliantBlue focus:outline-none" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <ul className={`flex-col md:flex-row md:flex gap-8 items-center font-semibold text-charcoalGray text-lg font-sans transition-all duration-300 ${open ? 'flex absolute top-20 left-0 w-full bg-diamondWhite/95 py-6 z-40 border-t-2 border-brilliantBlue/10' : 'hidden md:flex'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* Main Navigation */}
          <li><a href="/" className="hover:text-brilliantBlue transition-colors duration-200 px-2 py-1 rounded">Home</a></li>
          <li><a href="/shop" className="hover:text-brilliantBlue transition-colors duration-200 px-2 py-1 rounded">Shop</a></li>
          <li><a href="/customize" className="hover:text-brilliantBlue transition-colors duration-200 px-2 py-1 rounded">Customize</a></li>
          <li><a href="/wishlist" className="hover:text-brilliantBlue transition-colors duration-200 px-2 py-1 rounded">Wishlist</a></li>
          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-brilliantBlue/20"></div>
          {/* Company Info */}
          <li><a href="/about" className="hover:text-brilliantBlue transition-colors duration-200 px-2 py-1 rounded">About</a></li>
          <li><a href="/contact" className="hover:text-brilliantBlue transition-colors duration-200 px-2 py-1 rounded">Contact</a></li>
          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-brilliantBlue/20"></div>
          {/* User Actions */}
          <li><a href="/auth" className="hover:text-champagneGold transition-colors duration-200 px-2 py-1 rounded">Login / Sign Up</a></li>
          <li>
            <a href="/account" className="hover:text-champagneGold transition-colors duration-200 px-2 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:text-champagneGold transition-colors duration-200 px-2 py-1 rounded relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385m-.383-7.822L6.75 7.5m0 0h10.5m-10.5 0l1.7 6.385m0 0A2.25 2.25 0 0010.125 16.5h3.75a2.25 2.25 0 002.175-1.615l1.7-6.385m-10.5 0h10.5" />
              </svg>
              <CartCount />
            </a>
          </li>
        </ul>
      </nav>
      <style>{`
        .text-brilliantBlue { color: #4F8EF7; }
        .hover\:text-brilliantBlue:hover { color: #4F8EF7; }
        .bg-brilliantBlue { background-color: #4F8EF7; }
        .bg-diamondWhite { background-color: #F8F9FA; }
        .bg-platinumSilver { background-color: #E5E4E2; }
        .text-charcoalGray { color: #333333; }
        .hover\:text-champagneGold:hover { color: #FFD700; }
        .bg-champagneGold { background-color: #FFD700; }
        .border-brilliantBlue { border-color: #4F8EF7; }
        .border-champagneGold { border-color: #FFD700; }
        .shadow-elegant { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
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
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const { supabase } = require('./lib/supabase');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
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
        const { supabase } = require('./lib/supabase');
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
      const { supabase } = require('./lib/supabase');
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
        const { data, error } = await supabase
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
      const { supabase } = require('./lib/supabase');
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
      const { supabase } = require('./lib/supabase');
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
      const { supabase } = require('./lib/supabase');
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
const Footer = () => (
  <footer className="bg-gradient-to-br from-diamondWhite via-platinumSilver to-brilliantBlue/10 text-brilliantBlue pt-12 pb-6 px-4 mt-16 border-t border-brilliantBlue/20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <h3 className="font-serif text-2xl font-bold mb-3 text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>Shemesh Gold</h3>
        <p className="text-charcoalGray mb-4">Exquisite rings for life's most precious moments.</p>
        <div className="flex gap-4 mt-2">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-champagneGold transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-champagneGold transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 2.1c-3.9 0-7 3.1-7 7v2H7v3h3v7h3v-7h2.1l.4-3H13V9c0-1.1.9-2 2-2h2V4.1c0-1.1-.9-2-2-2z"/></svg></a>
          <a href="mailto:info@shemeshjewelry.com" className="hover:text-champagneGold transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.29 7.3a1 1 0 0 1-1.42 0L4 6.41V20h16V6.41z"/></svg></a>
        </div>
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold mb-2 text-brilliantBlue">Links</h4>
        <ul className="space-y-2">
          <li><a href="/shop" className="hover:text-champagneGold transition">Shop</a></li>
          <li><a href="/customize" className="hover:text-champagneGold transition">Customize</a></li>
          <li><a href="/wishlist" className="hover:text-champagneGold transition">Wishlist</a></li>
          <li><a href="/account" className="hover:text-champagneGold transition">Account</a></li>
          <li><a href="/about" className="hover:text-champagneGold transition">About</a></li>
          <li><a href="/contact" className="hover:text-champagneGold transition">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold mb-2 text-brilliantBlue">Contact</h4>
        <p className="text-charcoalGray">123 Diamond Ave, Tel Aviv</p>
        <p className="text-charcoalGray">info@shemeshjewelry.com</p>
        <p className="text-charcoalGray">+972 3-123-4567</p>
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold mb-2 text-brilliantBlue">Newsletter</h4>
        <form className="flex flex-col gap-2">
          <input type="email" placeholder="Your email" className="rounded-full px-4 py-2 bg-white/10 border border-brilliantBlue/40 text-brilliantBlue placeholder:text-champagneGold focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40" />
          <button type="submit" className="bg-brilliantBlue text-white font-bold rounded-full px-4 py-2 mt-1 shadow-elegant hover:bg-champagneGold hover:text-black transition-all duration-200 border border-champagneGold focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40">Subscribe</button>
        </form>
      </div>
    </div>
    <div className="text-center text-charcoalGray text-xs mt-10">&copy; {new Date().getFullYear()} Shemesh Gold. All rights reserved.</div>
  </footer>
);

const ADMIN_EMAILS = ['user123@gmail.com'];

function AdminRoute() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    import('./lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user || null);
        setLoading(false);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      return () => listener.subscription.unsubscribe();
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <AdminLogin onLogin={() => window.location.reload()} />;
  if (!ADMIN_EMAILS.includes(user.email)) return <div>Access denied</div>;
  return <AdminPanel ChangePassword={ChangePassword} />;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="min-h-screen bg-white font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
            <Route path="/customize" element={<RingCustomizer />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminRoute />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App; 