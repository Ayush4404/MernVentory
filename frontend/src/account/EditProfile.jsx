import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const EditProfile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    photo: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState(''); // State for profile update messages
  const [passwordMessage, setPasswordMessage] = useState(''); // State for password change messages
  const [loadingProfile, setLoadingProfile] = useState(false); // Loading state for profile form
  const [loadingPassword, setLoadingPassword] = useState(false); // Loading state for password form
  const [pageLoading, setPageLoading] = useState(true); // Initial page loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authentication token not found.');
          setPageLoading(false);
          return;
        }

        const config = { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        };

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getuser`, config);
        setForm(res.data);
        setImagePreview(res.data.photo || 'https://via.placeholder.com/200'); // Set default placeholder if no photo
      } catch (err) {
        console.error('Failed to fetch user:', err.response?.data?.message || err.message);
        setProfileMessage('❌ Failed to load profile data.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setLoadingProfile(true);

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    };

    const data = new FormData();
    data.append('name', form.name);
    data.append('phone', form.phone);
    data.append('bio', form.bio);
    if (photoFile) {
      data.append('photo', photoFile);
    }

    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/updateuser`, data, config);
      setProfileMessage('✅ Profile updated successfully!');
      // Optionally refetch user to ensure Header gets latest photo etc.
      // fetchUser(); 
    } catch (err) {
      console.error('Failed to update profile:', err.response?.data?.message || err.message);
      setProfileMessage('❌ Failed to update profile. Please try again.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setLoadingPassword(true);

    if (newPassword !== confirmPassword) {
      setPasswordMessage('❌ New passwords do not match!');
      setLoadingPassword(false);
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
        setPasswordMessage('❌ Please fill in all password fields.');
        setLoadingPassword(false);
        return;
    }


    const token = localStorage.getItem('token');
    const config = { 
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    };

    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/changepassword`, {
        oldPassword,
        newPassword
      }, config);
      setPasswordMessage('✅ Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to change password:', err.response?.data?.message || err.message);
      setPasswordMessage('❌ Failed to change password. ' + (err.response?.data?.message || 'Please check your old password.'));
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header title="Edit Profile" />
        <main className="p-8 max-w-5xl mx-auto"> {/* Increased max-width for overall layout */}
          {pageLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="ml-4 text-lg text-gray-600">Loading your profile details...</p>
            </div>
          ) : (
            <>
              {/* Edit Profile Section */}
              <div className="bg-white shadow-xl rounded-lg p-10 transform transition-shadow duration-300 hover:shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-4">Update Personal Information</h2>
                <form onSubmit={handleProfileSubmit} className="flex flex-col md:flex-row gap-10"> {/* Adjusted gap and responsiveness */}
                  {/* Photo Upload Section */}
                  <div className="w-full md:w-1/3 flex flex-col items-center"> {/* Centered photo on small screens */}
                    <div className="relative mb-6">
                      <img
                        src={imagePreview || 'https://via.placeholder.com/200'}
                        alt="Profile"
                        className="w-48 h-48 object-cover rounded-full border-4 border-blue-400 shadow-lg ring ring-blue-200 ring-offset-4 ring-offset-white transition-all duration-300 hover:scale-105"
                      />
                      <label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Click the camera icon to change your photo.</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Supported: JPG, PNG, GIF</p>
                  </div>

                  {/* Profile Details Form */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed for security reasons.</p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        rows="4"
                        placeholder="Tell us a little bit about yourself..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingProfile}
                      className={`w-full md:w-auto px-8 py-3 mt-4 rounded-md font-bold text-white tracking-wide transition-all duration-200 ease-in-out ${
                        loadingProfile ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      }`}
                    >
                      {loadingProfile ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    {profileMessage && (
                      <p className={`text-sm font-medium text-center mt-4 py-2 px-4 rounded-md ${
                        profileMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {profileMessage}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* Change Password Section */}
              <div className="bg-white shadow-xl rounded-lg p-10 mt-8 transform transition-shadow duration-300 hover:shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-4">Change Password</h2>
                <form onSubmit={handlePasswordReset} className="space-y-6"> {/* Increased space-y */}
                  <div>
                    <label htmlFor="old-password" className="block text-sm font-semibold text-gray-700 mb-2">Old Password</label>
                    <input
                      type="password"
                      id="old-password"
                      placeholder="Enter your old password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className={`w-full px-8 py-3 mt-4 rounded-md font-bold text-white tracking-wide transition-all duration-200 ease-in-out ${
                      loadingPassword ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  >
                    {loadingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Changing...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                  {passwordMessage && (
                    <p className={`text-sm font-medium text-center mt-4 py-2 px-4 rounded-md ${
                      passwordMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {passwordMessage}
                    </p>
                  )}
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProfile;