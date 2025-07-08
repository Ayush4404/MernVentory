import { NavLink, useLocation } from "react-router-dom";
import { FaTh, FaPlus, FaUser, FaBug, FaIdBadge, FaUserEdit, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Added chevron icons
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Keep submenu open if current route starts with /account
  useEffect(() => {
    if (location.pathname.startsWith("/profile") || location.pathname.startsWith("/edit-profile")) {
      setIsAccountOpen(true);
    } else {
        setIsAccountOpen(false); // Close if not in an account sub-route
    }
  }, [location.pathname]);

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 shadow-2xl z-50 flex flex-col"> {/* Added flex-col */}
      <div className="flex items-center justify-center h-16 border-b border-slate-700 px-4"> {/* Added px */}
        <h1 className="text-2xl font-bold text-orange-400 tracking-wide">Mernventory</h1> {/* Larger, bolder text, tracking */}
      </div>

      <nav className="flex-1 mt-5 overflow-y-auto custom-scrollbar pb-8"> {/* flex-1 to take available space, overflow for long lists */}

        {/* Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-5 transition-all duration-200 ease-in-out
             hover:bg-slate-700 hover:text-orange-300
             ${isActive ? "bg-slate-700 text-orange-400 border-l-4 border-orange-400 pl-4" : "text-gray-300"}` // Enhanced active state, border-left
          }
        >
          <FaTh className="text-lg" /> <span className="font-medium">Dashboard</span>
        </NavLink>

        {/* Add Product Link */}
        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-5 transition-all duration-200 ease-in-out
             hover:bg-slate-700 hover:text-orange-300
             ${isActive ? "bg-slate-700 text-orange-400 border-l-4 border-orange-400 pl-4" : "text-gray-300"}`
          }
        >
          <FaPlus className="text-lg" /> <span className="font-medium">Add Product</span>
        </NavLink>

        {/* Account Dropdown Toggle */}
        <button
          onClick={() => setIsAccountOpen(!isAccountOpen)}
          className={`flex w-full items-center gap-3 py-3 px-5 transition-all duration-200 ease-in-out focus:outline-none
            hover:bg-slate-700 hover:text-orange-300
            ${isAccountOpen || location.pathname.startsWith("/profile") || location.pathname.startsWith("/edit-profile") ? "bg-slate-700 text-orange-400" : "text-gray-300"}` // Active state for button
          }
        >
          <FaUser className="text-lg" /> <span className="font-medium">Account</span>
          {isAccountOpen ? <FaChevronUp className="ml-auto text-sm transition-transform duration-200" /> : <FaChevronDown className="ml-auto text-sm transition-transform duration-200" />} {/* Dynamic chevron icon */}
        </button>

        {/* Account Submenu - Conditional Rendering with Transition */}
        {isAccountOpen && (
          <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isAccountOpen ? '100px' : '0' }}> {/* Animated height */}
            <div className="ml-8 mt-1 space-y-1 py-1 border-l border-slate-600"> {/* Indentation and border */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ease-in-out
                   hover:bg-slate-600 hover:text-orange-300
                   ${isActive ? "bg-slate-600 text-orange-400" : "text-gray-400"}` // Submenu item active state
                }
              >
                <FaIdBadge className="text-sm" /> <span className="text-sm">My Profile</span> {/* Smaller icon, descriptive text */}
              </NavLink>
              <NavLink
                to="/edit-profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ease-in-out
                   hover:bg-slate-600 hover:text-orange-300
                   ${isActive ? "bg-slate-600 text-orange-400" : "text-gray-400"}`
                }
              >
                <FaUserEdit className="text-sm" /> <span className="text-sm">Edit Profile</span>
              </NavLink>
            </div>
          </div>
        )}

        {/* Report Bug Link */}
        <NavLink
          to="/reportbug"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3 px-5 transition-all duration-200 ease-in-out
             hover:bg-slate-700 hover:text-orange-300
             ${isActive ? "bg-slate-700 text-orange-400 border-l-4 border-orange-400 pl-4" : "text-gray-300"}`
          }
        >
          <FaBug className="text-lg" /> <span className="font-medium">Report Bug</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;