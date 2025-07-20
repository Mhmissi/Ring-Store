import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    console.log('Submitting contact form:', form);
    try {
      const { data, error } = await supabase.from('messages').insert({
        name: form.name,
        email: form.email,
        message: form.message,
        status: 'unread'
      });
      console.log('Supabase insert result:', { data, error });
      if (error) throw error;
      setStatus('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Error sending message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="bg-platinumSilver rounded-lg shadow-elegant p-8 flex flex-col gap-4 mb-8 border border-brilliantBlue/20 max-w-xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-brilliantBlue mb-1">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-brilliantBlue bg-diamondWhite text-charcoalGray" placeholder="Your Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-brilliantBlue mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-brilliantBlue bg-diamondWhite text-charcoalGray" placeholder="you@email.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-brilliantBlue mb-1">Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-brilliantBlue bg-diamondWhite text-charcoalGray" rows={4} placeholder="How can we help you?" required />
        </div>
        <button type="submit" disabled={submitting} className="bg-brilliantBlue hover:bg-champagneGold hover:text-black text-white font-semibold px-6 py-2 rounded-md shadow-elegant transition border border-champagneGold disabled:opacity-50">
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
        {status && <div className={`text-center mt-2 ${status.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>{status}</div>}
      </form>
      <div className="text-center text-charcoalGray">
        <div className="bg-softGray rounded-xl shadow-elegant p-8 border border-navyBlue/20">
          <h3 className="text-xl font-bold text-navyBlue mb-6">Contact Information</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-navyBlue mb-2">Grown Lab Diamond</h4>
              <p className="text-darkGray">Leading provider of ethically grown diamonds and sustainable luxury jewelry.</p>
            </div>
            <div>
              <h4 className="font-semibold text-navyBlue mb-2">Address</h4>
              <p className="text-darkGray">123 Diamond Avenue<br />Global Headquarters</p>
            </div>
            <div>
              <h4 className="font-semibold text-navyBlue mb-2">Phone</h4>
              <p className="text-darkGray">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-semibold text-navyBlue mb-2">Email</h4>
              <p className="text-darkGray">
                <a href="mailto:info@grownlabdiamond.com" className="text-navyBlue hover:text-warmGold transition">
                  info@grownlabdiamond.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 