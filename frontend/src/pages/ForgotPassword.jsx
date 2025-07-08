import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('✅ Reset email sent! Please check your inbox.');
        setEmail('');
      } else {
        setMsg(`❌ ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMsg('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <div className="flex justify-center items-center mb-4 text-3xl text-orange-600 font-bold">
          <MdEmail className="mr-2" /> Forgot Password
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Get Reset Email'}
          </button>
        </form>
        {msg && (
          <p className="mt-4 text-sm font-medium text-center text-gray-700">{msg}</p>
        )}
        <div className="mt-4 text-sm flex justify-between">
          <Link to="/" className="text-gray-700 hover:underline">Home</Link>
          <Link to="/login" className="text-gray-700 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
