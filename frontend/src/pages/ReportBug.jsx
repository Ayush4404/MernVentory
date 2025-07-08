import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaBug, FaPaperPlane } from 'react-icons/fa'; // Added FaPaperPlane and FaBug
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5'; // For success/error icons

const ReportBug = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' }); // State for feedback messages
  const [loading, setLoading] = useState(false); // Loading state for button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' }); // Clear previous feedback
    setLoading(true);

    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: 'error', message: 'Please fill out both the subject and message fields.' });
      setLoading(false);
      return;
    }

    // Simulate API call
    console.log('Bug Report:', { subject, message });
    try {
      // In a real application, you would send this data to your backend
      // const response = await axios.post('/api/report-bug', { subject, message });
      // console.log(response.data);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      setFeedback({ type: 'success', message: 'Thank you! Your bug report has been submitted successfully.' });
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Bug report submission error:', error);
      setFeedback({ type: 'error', message: 'Failed to submit bug report. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header title="Report a Bug" /> {/* Adjusted title */}

        <main className="p-8 max-w-6xl mx-auto"> {/* Increased max-width for more space */}
          <div className="flex flex-col md:flex-row gap-10"> {/* Increased gap between sections */}

            {/* Bug Report Form */}
            <div className="bg-white p-10 rounded-xl shadow-lg flex-1 transform transition-shadow duration-300 hover:shadow-xl"> {/* Enhanced styling */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaBug className="mr-3 text-red-500" /> {/* Bug icon */}
                Submit a Bug Report
              </h2>
              <p className="text-gray-600 mb-8">
                Found something not working as expected? Please let us know the details so we can fix it!
              </p>
              <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased vertical spacing */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Dashboard metrics are incorrect"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label> {/* More descriptive label */}
                  <textarea
                    id="message"
                    rows="7" // Increased rows for more space
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the issue you're experiencing, including steps to reproduce it, expected behavior, and actual behavior." // More detailed placeholder
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400 resize-y" // Added resize-y
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ease-in-out ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" /> Send Report
                    </>
                  )}
                </button>

                {feedback.message && (
                  <div className={`mt-6 p-4 rounded-lg flex items-center ${
                    feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {feedback.type === 'success' ? (
                      <IoCheckmarkCircle className="text-xl mr-3" />
                    ) : (
                      <IoWarning className="text-xl mr-3" />
                    )}
                    <p className="font-medium">{feedback.message}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 rounded-xl shadow-lg w-full md:w-[350px] flex-shrink-0"> {/* Enhanced gradient, padding, and width */}
              <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2> {/* Changed heading */}
              <p className="text-blue-100 text-base mb-6 leading-relaxed">
                While we work on your bug, you can also reach our support team through these channels:
              </p>
              <ul className="space-y-5 text-base"> {/* Increased spacing */}
                <li className="flex items-center gap-3"> {/* Increased gap with icon */}
                  <FaPhoneAlt className="text-blue-200 text-xl" /> <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-200 text-xl" /> <a href="mailto:support@mernventory.com" className="hover:underline">support@mernventory.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-200 text-xl" /> Ludhiana, Punjab, India {/* Updated address based on context */}
                </li>
                <li className="flex items-center gap-3">
                  <FaTwitter className="text-blue-200 text-xl" /> <a href="https://twitter.com/Mernventory" target="_blank" rel="noopener noreferrer" className="hover:underline">@Mernventory</a>
                </li>
              </ul>
              <div className="mt-10 pt-6 border-t border-blue-500 text-blue-200 text-sm">
                <p>&copy; {new Date().getFullYear()} Mernventory. All rights reserved.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportBug;