import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      };

      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      if (image) data.append('image', image);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, data, config);
      setMsg('✅ Product added successfully!');
      setFormData({ name: '', category: '', price: '', quantity: '' });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Add product error:', error);
      setMsg('❌ Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header title="Add New Product" />
        <main className="p-8 max-w-4xl mx-auto"> {/* Increased max-width for better layout */}
          <div className="bg-white shadow-lg rounded-lg p-10 transform transition-all duration-300 hover:shadow-xl"> {/* Adjusted padding and shadow */}
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Add New Product Details</h2> {/* Added a title for the form */}
            <form onSubmit={handleSubmit} className="space-y-7"> {/* Adjusted spacing between form fields */}
              
              {/* Product Image Upload */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50"> {/* Added a subtle background and border */}
                <label htmlFor="product-image" className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                <p className="text-xs text-gray-500 mb-4">
                  Supported Formats: JPG, JPEG, PNG (Max file size: 5MB) {/* More descriptive helper text */}
                </p>
                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg, image/png" // More specific accept types
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-100 file:text-blue-700
                             hover:file:bg-blue-200 cursor-pointer transition-colors duration-200"
                />
                {imagePreview && (
                  <div className="mt-6 text-center"> {/* Centered image preview */}
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="max-h-56 mx-auto object-contain rounded-lg border border-gray-300 shadow-md" // Adjusted max-height, added shadow
                    />
                  </div>
                )}
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Used a grid for better layout on larger screens */}
                {/* Product Name */}
                <div>
                  <label htmlFor="product-name" className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input
                    id="product-name"
                    type="text"
                    name="name"
                    placeholder="e.g., Organic Honey"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700 placeholder-gray-400" // Adjusted padding, focus styles, and placeholder color
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="product-category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    id="product-category"
                    type="text"
                    name="category"
                    placeholder="e.g., Groceries, Electronics"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700 placeholder-gray-400"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="product-price" className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label> {/* Added currency hint */}
                  <input
                    id="product-price"
                    type="number"
                    name="price"
                    placeholder="e.g., 29.99"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700 placeholder-gray-400"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0" // Added min attribute for price
                    step="0.01" // Allow decimal values for price
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="product-quantity" className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <input
                    id="product-quantity"
                    type="number"
                    name="quantity"
                    placeholder="e.g., 150"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700 placeholder-gray-400"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0" // Added min attribute for quantity
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white tracking-wide transition-all duration-200 ease-in-out
                            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`} // Enhanced button styles
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div> {/* Slightly larger spinner and margin */}
                    Adding Product...
                  </div>
                ) : (
                  'Add Product'
                )}
              </button>

              {/* Message Display */}
              {msg && (
                <p className={`text-md font-semibold text-center mt-6 py-2 px-4 rounded-lg
                                ${msg.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}> {/* Styled message for better visibility */}
                  {msg}
                </p>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;