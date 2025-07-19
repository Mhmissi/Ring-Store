import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthPage({ onAuth }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let result;
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error && result.data?.user) {
        await supabase.from('profiles').upsert({
          id: result.data.user.id,
          name,
          surname,
          address,
        });
      }
    }
    if (result.error) setError(result.error.message);
    else navigate(redirectTo);
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth'
    });
    if (error) setError(error.message);
    else setResetMessage('Password reset email sent! Check your inbox.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={resetMode ? handlePasswordReset : handleAuth} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {resetMode ? 'Reset Password' : mode === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {resetMessage && <div className="mb-4 text-green-600">{resetMessage}</div>}
        {resetMode ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-6 px-3 py-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-gold font-bold py-2 rounded hover:bg-gold hover:text-black transition"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <div className="mt-4 text-center">
              <button type="button" className="text-gold underline" onClick={() => setResetMode(false)}>
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            {mode === 'signup' && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Surname"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 px-3 py-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 px-3 py-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-gold font-bold py-2 rounded hover:bg-gold hover:text-black transition"
              disabled={loading}
            >
              {loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
            </button>
            {mode === 'login' && (
              <div className="mt-4 text-center">
                <button type="button" className="text-gold underline" onClick={() => setResetMode(true)}>
                  Forgot password?
                </button>
              </div>
            )}
            <div className="mt-4 text-center">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button type="button" className="text-gold underline" onClick={() => setMode('signup')}>
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" className="text-gold underline" onClick={() => setMode('login')}>
                    Log in
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
} 