import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaAsterisk } from 'react-icons/fa';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/resetpassword/${resetToken}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(`❌ ${data.message || 'Reset failed'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <div className="flex justify-center items-center mb-4 text-3xl text-orange-600 font-bold">
          <FaAsterisk className="mr-2" /> Reset Password
        </div>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center font-medium text-gray-700">{message}</p>
        )}

        <div className="mt-4 text-sm flex justify-between">
          <Link to="/" className="text-gray-700 hover:underline">Home</Link>
          <Link to="/login" className="text-gray-700 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
