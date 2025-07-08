import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./account/Profile";
import EditProfile from "./account/EditProfile";
import ReportBug from "./pages/ReportBug";
import { ToastContainer } from 'react-toastify';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/reportbug" element={<ReportBug />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        
      </Routes><ToastContainer />
    </BrowserRouter>
    
  );
}

export default App;
