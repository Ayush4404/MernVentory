import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getuser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err.response?.data?.message || err.message);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header user={user} />
        <main className="p-8 max-w-5xl mx-auto"> {/* Increased max-width for a more spacious layout */}
          <div className="bg-white shadow-xl rounded-lg p-10 transform transition-shadow duration-300 hover:shadow-2xl"> {/* Adjusted padding and shadow */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-4">Your Profile</h2> {/* Added a title with a bottom border */}

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600">Loading profile...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 font-medium py-8">
                <p>{error}</p>
                <p className="text-sm text-gray-500 mt-2">Ensure you are logged in and have a stable internet connection.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10"> {/* More responsive gap and alignment */}
                {/* Profile Image Section */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={user.photo || 'https://via.placeholder.com/200'} // Larger placeholder
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-full border-4 border-blue-400 shadow-lg ring ring-blue-200 ring-offset-4 ring-offset-white transition-all duration-300 hover:scale-105" // Circular image, enhanced border, ring effect, and hover animation
                  />
                  {/* Could add an "Edit Photo" icon here later */}
                </div>

                {/* User Details Section */}
                <div className="flex-1 space-y-6 text-center md:text-left"> {/* Centered text on small screens, left-aligned on medium and up */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Full Name</h3> {/* Uppercase labels */}
                    <p className="text-xl font-bold text-gray-800 mt-1">{user.name || 'N/A'}</p> {/* Larger and bolder text */}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email Address</h3>
                    <p className="text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 mt-1">{user.email || 'N/A'}</p> {/* Email link-like color */}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone Number</h3>
                    <p className="text-lg font-medium text-gray-800 mt-1">{user.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bio</h3>
                    <p className="text-lg font-medium text-gray-700 leading-relaxed mt-1">{user.bio || 'No bio provided.'}</p> {/* Adjusted line-height */}
                  </div>

                  <div className="pt-4"> {/* Added padding top for separation from bio */}
                    <a
                      href="/edit-profile"
                      className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105" // Pill-shaped button, enhanced hover/focus, scale effect
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
                      </svg>
                      Edit Profile
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;