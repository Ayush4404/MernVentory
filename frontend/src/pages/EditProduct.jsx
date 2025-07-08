// src/pages/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaUpload, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Added icons

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // To display existing image
  const [message, setMessage] = useState({ type: '', text: '' }); // Enhanced message state
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  const fetchProduct = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, config);
      setFormData({
        name: res.data.name,
        category: res.data.category,
        price: res.data.price,
        quantity: res.data.quantity,
        description: res.data.description,
      });
      setCurrentImageUrl(res.data.image); // Set current image URL
    } catch (error) {
      console.error('Error loading product:', error.response?.data?.message || error.message);
      setMessage({ type: 'error', text: 'Failed to load product for editing.' });
      // Optionally redirect or show a critical error page
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, navigate]); // Add navigate to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' }); // Clear previous messages

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Axios handles boundary for FormData
        },
        withCredentials: true,
      };

      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (image) {
        data.append('image', image);
      } else if (currentImageUrl && !image) {
        // If no new image selected but there was an old one, keep it
        // This implicitly happens if 'image' field is not appended
      } else if (!currentImageUrl && !image) {
        // If no current image and no new image, ensure backend handles this (e.g., set to null)
        // Or explicitly send an indicator to remove image if allowed
      }


      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, data, config);
      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setTimeout(() => navigate('/dashboard'), 1500); // Navigate after a short delay
    } catch (error) {
      console.error('Update failed', error.response?.data?.message || error.message);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      // Optionally show a preview of the new image
      // setCurrentImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fields = [
    { name: 'name', label: 'Product Name', type: 'text', placeholder: 'e.g., Samsung Galaxy S25' },
    { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Electronics, Apparel' },
    { name: 'price', label: 'Price', type: 'number', placeholder: 'e.g., 799.99' },
    { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'e.g., 50' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'A detailed description of the product features and specifications.' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header title="Edit Product" />
        <main className="p-8 max-w-4xl mx-auto"> {/* Increased max-width */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200"> {/* Enhanced card styling */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <FaEdit className="mr-3 text-blue-600" />
              Edit Product Details
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-lg text-gray-600">Loading product data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased vertical spacing */}
                {fields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows="5" // Increased rows for description
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y"
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                      ></textarea>
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                        min={field.type === 'number' ? '0' : undefined} // Ensure non-negative numbers
                        step={field.name === 'price' ? '0.01' : '1'} // Allow decimals for price
                      />
                    )}
                  </div>
                ))}

                {/* Image Upload Section */}
                <div className="mb-4">
                  <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  {currentImageUrl && !image && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                      <img src={currentImageUrl} alt="Current Product" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {image && (
                      <span className="text-sm text-gray-600">
                        {image.name} ({Math.round(image.size / 1024)} KB)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Upload a new image to replace the current one. Max file size: 5MB.</p>
                </div>

                {/* Form Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
                      isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {isSubmitting ? 'Updating...' : 'Update Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)} // Go back to previous page
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-200"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>

                {/* Feedback Message */}
                {message.text && (
                  <div className={`mt-6 p-4 rounded-lg flex items-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message.type === 'success' ? (
                      <FaCheckCircle className="text-xl mr-3" />
                    ) : (
                      <FaExclamationCircle className="text-xl mr-3" />
                    )}
                    <p className="font-medium">{message.text}</p>
                  </div>
                )}
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;