import { useState } from 'react';
import { supabase } from '../lib/supabase';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else setMessage('Password updated successfully!');
    setNewPassword('');
  };

  return (
    <form onSubmit={handleChangePassword} className="mb-4">
      <label className="block mb-1 font-semibold">Change Admin Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        placeholder="New password"
        className="border px-3 py-2 rounded w-full mb-2"
        required
      />
      <button
        type="submit"
        className="bg-black text-gold px-4 py-2 rounded font-bold"
      >
        Change Password
      </button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
}

export default ChangePassword; 