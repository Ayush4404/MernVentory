// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; // Added FaUserCircle

const Header = ({ user }) => { // The 'user' prop is preferred for real-time updates
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('User');
  const [showDropdown, setShowDropdown] = useState(false); // State for a potential user dropdown

  useEffect(() => {
    // Prioritize the 'user' prop if passed (e.g., from a global state or context)
    if (user && user.name) {
      setDisplayName(user.name);
    } else {
      // Fallback to localStorage if 'user' prop is not available or doesn't have a name
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.name) {
          setDisplayName(storedUser.name);
        } else {
          setDisplayName('Guest'); // Default if no user found
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setDisplayName('Guest'); // Handle parsing errors
      }
    }
  }, [user]); // Depend on 'user' prop for updates

  const handleLogout = () => {
    // Using a more visually appealing confirmation (could be a modal in a real app)
    const confirmLogout = window.confirm('Are you sure you want to log out from Mernventory?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally clear any other user-related states globally
      navigate('/login');
    }
    setShowDropdown(false); // Close dropdown after action
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-lg border-b border-gray-200"> {/* Increased padding, deeper shadow, subtle border */}
      <h2 className="text-2xl font-bold text-gray-800 flex items-center"> {/* Larger, bolder title */}
        <span className="mr-2 text-blue-600">👋</span> {/* Welcome emoji/icon */}
        Welcome, <span className="text-orange-500 ml-2">{displayName}</span> {/* Adjusted color intensity */}
      </h2>

      <div className="relative"> {/* Use relative positioning for dropdown */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaUserCircle className="text-xl text-gray-500" /> {/* User icon */}
          <span className="font-medium">{displayName}</span>
          <span className="ml-2 text-sm">{showDropdown ? '▲' : '▼'}</span> {/* Dropdown indicator */}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200 animate-fade-in"> {/* Dropdown styling */}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-150"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            {/* You could add more profile-related links here */}
            {/*
            <button
              onClick={() => { navigate('/profile'); setShowDropdown(false); }}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <FaUser /> Profile
            </button>
            */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;