import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
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

    try {
      const { data, error } = await supabase.from('messages').insert({
        name: form.name,
        email: form.email,
        message: form.message,
        status: 'unread'
      });

      if (error) throw error;
      setStatus(t('messageSent'));
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(t('errorSendingMessage'));
      console.error('Contact form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-diamondWhite min-h-screen font-sans px-4 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center text-brilliantBlue" style={{ fontFamily: 'Playfair Display, serif' }}>
        {t('contactUs')}
      </h1>
      
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-platinumSilver rounded-lg shadow-elegant p-8 flex flex-col gap-4 mb-8 border border-brilliantBlue/20 max-w-xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-brilliantBlue mb-1">{t('name')}</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-brilliantBlue bg-diamondWhite text-charcoalGray" placeholder={t('yourName')} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-brilliantBlue mb-1">{t('email')}</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-brilliantBlue bg-diamondWhite text-charcoalGray" placeholder="you@email.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-brilliantBlue mb-1">{t('message')}</label>
          <textarea name="message" value={form.message} onChange={handleChange} className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-brilliantBlue bg-diamondWhite text-charcoalGray" rows={4} placeholder={t('howCanWeHelp')} required />
        </div>
        <button type="submit" disabled={submitting} className="bg-brilliantBlue hover:bg-champagneGold hover:text-black text-white font-semibold px-6 py-2 rounded-md shadow-elegant transition border border-champagneGold disabled:opacity-50">
          {submitting ? t('sending') : t('sendMessage')}
        </button>
        {status && <div className={`text-center mt-2 ${status.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>{status}</div>}
      </form>

      {/* Contact Information and Map Card */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-softGray rounded-xl shadow-elegant border border-navyBlue/20 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Contact Information - 60% */}
            <div className="w-full lg:w-3/5 p-8">
              <h3 className="text-2xl font-bold text-navyBlue mb-6">{t('contactInformation')}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navyBlue mb-2">Grown Lab Diamond</h4>
                  <p className="text-darkGray">{t('leadingProvider')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-navyBlue mb-2">{t('address')}</h4>
                  <p className="text-darkGray">Koningin Astridplein 31<br />2018 Antwerpen, Belgium</p>
                </div>
                <div>
                  <h4 className="font-semibold text-navyBlue mb-2">{t('phone')}</h4>
                  <p className="text-darkGray">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold text-navyBlue mb-2">WhatsApp</h4>
                  <p className="text-darkGray">
                    <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="text-navyBlue hover:text-warmGold transition flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      +1 (555) 123-4567
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-navyBlue mb-2">{t('email')}</h4>
                  <p className="text-darkGray">
                    <a href="mailto:info@grownlabdiamond.com" className="text-navyBlue hover:text-warmGold transition">
                      info@grownlabdiamond.com
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-navyBlue mb-2">{t('businessHours')}</h4>
                  <div className="text-darkGray space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: Closed</p>
                    <p>Sunday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map - 40% */}
            <div className="w-full lg:w-2/5 h-80 lg:h-auto">
              <div className="w-full h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.1234567890123!2d4.421234567890123!3d51.21987654321098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f6b8b8b8b8b8%3A0x1234567890abcdef!2sKoningin%20Astridplein%2031%2C%202018%20Antwerpen%2C%20Belgium!5e0!3m2!1sen!2sbe!4v1640995200000!5m2!1sen!2sbe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Grown Lab Diamond Location - Koningin Astridplein 31"
                  className="rounded-r-xl"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 