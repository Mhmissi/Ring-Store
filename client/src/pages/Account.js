import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../App';

export default function Account() {
  const { addToCart } = useCart();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: '', address: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = '/auth';
        return;
      }
      setUser(session.user);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileData) setProfile(profileData);
      // Fetch orders for this user
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      setOrders(ordersData || []);
      setLoading(false);
    };
    getUserAndProfile();
    // Load wishlist from localStorage
    const stored = localStorage.getItem('wishlist');
    setWishlist(stored ? JSON.parse(stored) : []);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
      })
      .eq('id', user.id);
    if (error) setMessage(error.message);
    else setMessage('Profile updated!');
    setEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  // Wishlist logic
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const addProductToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    alert('Added to cart!');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="bg-diamondWhite min-h-screen py-10 px-2 font-sans">
      <div className="max-w-2xl mx-auto bg-platinumSilver rounded-2xl shadow-elegant border border-brilliantBlue/10 p-6 sm:p-10">
        <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-brilliantBlue mb-8 text-center tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>My Account</h2>
        <div className="bg-brilliantBlue/5 rounded-xl p-6 mb-8 shadow-sm border border-brilliantBlue/10">
          {message && <div className={`mb-4 text-sm font-semibold ${message.includes('updated') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
          {!editing ? (
            <>
              <div className="mb-2 text-charcoalGray"><span className="font-semibold">Name:</span> {profile.name}</div>
              <div className="mb-2 text-charcoalGray"><span className="font-semibold">Email:</span> {user.email}</div>
              <div className="mb-2 text-charcoalGray"><span className="font-semibold">Address:</span> {profile.address}</div>
              <div className="mb-2 text-charcoalGray"><span className="font-semibold">Phone:</span> {profile.phone || '-'}</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="bg-brilliantBlue text-white font-bold rounded-full px-6 py-2 shadow-elegant hover:bg-champagneGold hover:text-black transition border border-brilliantBlue focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40"
                  onClick={() => setEditing(true)}
                >Edit Profile</button>
                <button
                  className="bg-red-600 text-white font-bold rounded-full px-6 py-2 shadow hover:bg-brilliantBlue hover:text-white transition border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                  onClick={handleLogout}
                >Logout</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-charcoalGray">Name:</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-md border border-brilliantBlue/30 focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 bg-diamondWhite text-charcoalGray"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-charcoalGray">Address:</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-md border border-brilliantBlue/30 focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 bg-diamondWhite text-charcoalGray"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-charcoalGray">Phone:</label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-brilliantBlue/30 focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40 bg-diamondWhite text-charcoalGray"
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-brilliantBlue text-white font-bold rounded-full px-6 py-2 shadow-elegant hover:bg-champagneGold hover:text-black transition border border-brilliantBlue focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40"
                >Save</button>
                <button
                  type="button"
                  className="bg-platinumSilver text-brilliantBlue font-bold rounded-full px-6 py-2 shadow-elegant hover:bg-champagneGold hover:text-black transition border border-platinumSilver focus:outline-none focus:ring-2 focus:ring-brilliantBlue/20"
                  onClick={() => setEditing(false)}
                >Cancel</button>
              </div>
            </form>
          )}
        </div>
        <div className="bg-brilliantBlue/5 rounded-xl p-6 shadow-sm border border-brilliantBlue/10 mb-8">
          <h3 className="font-serif font-bold text-2xl text-brilliantBlue mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>My Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-brilliantBlue font-bold text-base">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Items</th>
                  <th className="py-2 px-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-brilliantBlue py-6">No orders yet.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="border-t border-brilliantBlue/10 hover:bg-brilliantBlue/5 transition">
                      <td className="py-2 px-3 font-mono text-charcoalGray">{order.id.slice(0, 8)}...</td>
                      <td className="py-2 px-3 text-charcoalGray">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-charcoalGray">{order.status}</td>
                      <td className="py-2 px-3 text-charcoalGray">
                        {Array.isArray(order.items)
                          ? order.items.map((item, i) => (
                              <span key={i}>
                                {item.product} x{item.qty}
                                {i < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          : '-'}
                      </td>
                      <td className="py-2 px-3 text-champagneGold font-bold">${order.total?.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Wishlist Section */}
        <div className="bg-brilliantBlue/5 rounded-xl p-6 shadow-sm border border-brilliantBlue/10">
          <h3 className="font-serif font-bold text-2xl text-brilliantBlue mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>My Wishlist</h3>
          {wishlist.length === 0 ? (
            <div className="text-center text-brilliantBlue py-6">Your wishlist is empty. <a href='/shop' className='underline hover:text-champagneGold'>Shop Rings</a></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wishlist.map(item => (
                <div key={item.id} className="bg-diamondWhite rounded-lg shadow-elegant p-6 border border-brilliantBlue/10 flex flex-col items-center">
                  <img src={item.image || (process.env.PUBLIC_URL + '/ringstestimages/halo seting gold ring.jpg')} alt="Wishlist Ring" className="w-20 h-20 object-cover rounded-full border-2 border-brilliantBlue/10" />
                  <div className="font-serif text-lg font-bold mb-1 text-center text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>{item.name}</div>
                  <div className="text-champagneGold text-base mb-3 font-semibold">{item.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                  <div className="flex gap-2">
                    <button className="bg-brilliantBlue text-white font-bold rounded shadow-elegant hover:bg-champagneGold hover:text-black transition text-sm tracking-wide border border-brilliantBlue px-6 py-2 mt-2" onClick={() => addProductToCart(item)}>Add to Cart</button>
                    <button className="px-4 py-2 bg-diamondWhite border border-champagneGold text-brilliantBlue rounded font-bold hover:bg-champagneGold hover:text-black transition" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 