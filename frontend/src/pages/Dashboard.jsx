import React, { useEffect, useState } from 'react';
import {
  FaShoppingCart,
  FaDollarSign,
  FaBoxes,
  FaThList,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlusCircle, // Added for a prominent "Add Product" button
  FaSpinner,    // For loading state within buttons
} from 'react-icons/fa';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

// Enhanced StatCard Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`flex items-center gap-4 bg-white border-l-8 border-${color}-500 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
    <div className={`p-4 bg-${color}-100 rounded-full flex items-center justify-center`}> {/* Increased padding, flex for centering */}
      <Icon className={`text-${color}-600 text-3xl`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</p> {/* Uppercase, bolder title */}
      <h3 className={`text-2xl font-extrabold text-${color}-800 mt-1`}>{value}</h3> {/* Larger, extra bold value */}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // State to track which product is being deleted
  const navigate = useNavigate();

  const fetchStatsAndProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle no token case, e.g., redirect to login
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

      const statsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/stats/inventory`, config);
      setStats(statsRes.data);

      const productsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, config);
      const productData = productsRes.data?.products || productsRes.data || [];
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Optionally show a user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setDeletingId(id); // Set the ID of the product being deleted
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, config);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted successfully!'); // Provide feedback
    } catch (error) {
      console.error('Failed to delete product', error.response?.data?.message || error.message);
      alert('Failed to delete product. Please try again.'); // Provide feedback
    } finally {
      setDeletingId(null); // Clear deleting state
    }
  };

  useEffect(() => {
    fetchStatsAndProducts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header />
        <main className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Inventory Overview</h1> {/* Larger, bolder title */}
            <button
              onClick={() => navigate('/add-product')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
            >
              <FaPlusCircle className="text-xl" />
              Add New Product
            </button>
          </div>

          {/* Stat Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"> {/* Increased gap and bottom margin */}
            <StatCard title="Total Products" value={stats.totalProducts || 0} icon={FaShoppingCart} color="purple" />
            <StatCard title="Total Store Value" value={`$${(stats.totalStoreValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={FaDollarSign} color="green" /> {/* Formatted currency */}
            <StatCard title="Out of Stock" value={stats.outOfStock || 0} icon={FaBoxes} color="red" />
            <StatCard title="All Categories" value={stats.categories || 0} icon={FaThList} color="blue" />
          </div>

          {/* Inventory Items Table Section */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Product List</h2> {/* Larger, bolder title */}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-4 text-lg text-gray-600">Loading inventory data...</p>
            </div>
          ) : (
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200"> {/* Added border */}
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 italic text-lg">
                    <p className="mb-2">No products found in your inventory.</p>
                    <p>Start by clicking "Add New Product" to populate your list!</p>
                  </div>
                ) : (
                  <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200"> {/* Added divide-y */}
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs tracking-wider"> {/* Lighter background, bolder text, tracking */}
                      <tr>
                        <th className="py-4 px-6 text-left border-b border-gray-200">S/N</th> {/* Added px */}
                        <th className="py-4 px-6 text-left border-b border-gray-200">Product Name</th> {/* More descriptive */}
                        <th className="py-4 px-6 text-left border-b border-gray-200">Category</th>
                        <th className="py-4 px-6 text-left border-b border-gray-200">Price</th>
                        <th className="py-4 px-6 text-left border-b border-gray-200">Quantity</th>
                        <th className="py-4 px-6 text-left border-b border-gray-200">Total Value</th> {/* More descriptive */}
                        <th className="py-4 px-6 text-center border-b border-gray-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100"> {/* Added divide-y */}
                      {products.map((p, index) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-4 px-6 text-left whitespace-nowrap">{index + 1}</td>
                          <td className="py-4 px-6 text-left font-medium text-gray-800">{p.name}</td> {/* Bolder name */}
                          <td className="py-4 px-6 text-left">{p.category}</td>
                          <td className="py-4 px-6 text-left">${parseFloat(p.price).toFixed(2)}</td> {/* Ensure price is formatted */}
                          <td className="py-4 px-6 text-left">{p.quantity}</td>
                          <td className="py-4 px-6 text-left">${(p.price * p.quantity).toFixed(2)}</td>
                          <td className="py-4 px-6 text-center flex justify-center items-center space-x-4"> {/* Increased space */}
                            <button
                              className="text-purple-600 hover:text-purple-800 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full p-2"
                              title="View Details"
                              onClick={() => navigate(`/product/${p._id}`)}
                            >
                              <FaEye className="text-lg" /> {/* Larger icon */}
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-full p-2"
                              title="Edit Product"
                              onClick={() => navigate(`/edit-product/${p._id}`)}
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button
                              className={`text-red-600 hover:text-red-800 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-2 ${deletingId === p._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete Product"
                              onClick={() => deleteProduct(p._id)}
                              disabled={deletingId === p._id}
                            >
                              {deletingId === p._id ? <FaSpinner className="animate-spin text-lg" /> : <FaTrash className="text-lg" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;