import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for potential actions
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { FaBoxes, FaDollarSign, FaTag, FaInfoCircle, FaBarcode, FaClock, FaEdit, FaTrash } from 'react-icons/fa'; // Added more icons
import { BiCategory } from 'react-icons/bi'; // For category icon

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if no token is found
        navigate('/login');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, config);
      setProduct(res.data);
    } catch (err) {
      console.error('Error fetching product details:', err.response?.data?.message || err.message);
      setError('Failed to load product details. Please try again.');
      setProduct(null); // Ensure product is null on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, config);
        alert('Product deleted successfully!');
        navigate('/dashboard'); // Go back to dashboard after deletion
      } catch (err) {
        console.error('Error deleting product:', err.response?.data?.message || err.message);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, navigate]); // Add navigate to dependency array

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex flex-col items-center justify-center">
          <div className="text-red-600 text-3xl mb-4">⚠️</div>
          <p className="text-xl text-red-700 font-semibold">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex flex-col items-center justify-center">
          <div className="text-gray-500 text-5xl mb-4">😔</div>
          <p className="text-xl text-gray-600 font-semibold">Product not found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header title={`Product: ${product.name}`} />
        <main className="p-8 max-w-5xl mx-auto"> {/* Increased max-width for better content display */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 transform transition-transform duration-300 hover:scale-[1.005]"> {/* Enhanced card styling */}
            <div className="flex flex-col md:flex-row gap-8"> {/* Responsive layout for image and details */}
              {/* Product Image */}
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <img
                  src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                 
                  alt={product.name}
                  className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md border border-gray-100"
                />
              </div>

              {/* Product Details */}
              <div className="w-full md:w-1/2 space-y-5 text-gray-700"> {/* Increased space-y */}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h2> {/* Larger, bolder name */}

                <p className="flex items-center text-lg">
                  <BiCategory className="mr-3 text-blue-500 text-xl" />
                  <strong className="text-gray-800">Category:</strong> <span className="ml-2 capitalize">{product.category}</span>
                </p>

                <p className="flex items-center text-lg">
                  <FaDollarSign className="mr-3 text-green-500 text-xl" />
                  <strong className="text-gray-800">Price:</strong> <span className="ml-2 font-semibold text-green-600">${parseFloat(product.price).toFixed(2)}</span>
                </p>

                <p className="flex items-center text-lg">
                  <FaBoxes className="mr-3 text-purple-500 text-xl" />
                  <strong className="text-gray-800">Quantity:</strong> <span className="ml-2 font-semibold text-purple-600">{product.quantity} units</span>
                </p>

                <p className="flex items-start text-lg"> {/* align items-start for multiline description */}
                  <FaInfoCircle className="mr-3 text-indigo-500 text-xl mt-1" /> {/* Adjusted margin-top for icon */}
                  <strong className="text-gray-800">Description:</strong> <span className="ml-2 leading-relaxed">{product.description || 'No description provided.'}</span> {/* Fallback message */}
                </p>

                <p className="flex items-center text-lg">
                  <FaBarcode className="mr-3 text-orange-500 text-xl" />
                  <strong className="text-gray-800">SKU:</strong> <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">{product.sku}</span> {/* Styled SKU */}
                </p>
                <p className="flex items-center text-lg">
                    <FaClock className="mr-3 text-gray-500 text-xl" />
                    <strong className="text-gray-800">Created:</strong> <span className="ml-2">{new Date(product.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="flex items-center text-lg">
                    <FaClock className="mr-3 text-gray-500 text-xl" />
                    <strong className="text-gray-800">Last Updated:</strong> <span className="ml-2">{new Date(product.updatedAt).toLocaleDateString()}</span>
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 mt-8"> {/* Separator line */}
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                  >
                    <FaEdit /> Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
                  >
                    <FaTrash /> Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;