import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./Home";
import ForgotPassword from "./pages/ForgotPassword";

/* FARMER */
import FarmerDashboard from "./pages/Farmer/Dashboard";
import Addcrop from "./pages/Farmer/Addcrop";
import Mycrops from "./pages/Farmer/Mycrops";
import FarmerOrders from "./pages/Farmer/Orders";

import AIAdvisor from "./pages/Farmer/AIAdvisor";

/* CUSTOMER */
import CustomerDashboard from "./pages/Customer/Dashboard";
import Products from "./pages/Customer/Products";
import Cart from "./pages/Customer/Cart";
import MyOrders from "./pages/Customer/MyOrders";
import OrderDetails from "./pages/Customer/OrderDetails";
import Profile from "./pages/Customer/Profile";

/* DISTRIBUTOR */
import DistributorLayout from "./Layouts/Distributorlayout";
import DistributorDashboard from "./pages/Distributor/Dashboard";
import Marketplace from "./pages/Distributor/Marketplace";
import DistributorOrders from "./pages/Distributor/Orders";
import DistributorSuppliers from "./pages/Distributor/Suppliers";
import DistributorInsights from "./pages/Distributor/Insights";

/* ADMIN */
import AdminLayout from "./Layouts/Adminlayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminProducts from "./pages/Admin/Products";
import AdminOrders from "./pages/Admin/Orders";
import UserDetails from "./pages/Admin/UserDetails";


function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* FARMER */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute role="FARMER"><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/farmer/add-crop" element={<ProtectedRoute role="FARMER"><Addcrop /></ProtectedRoute>} />
        <Route path="/farmer/my-crops" element={<ProtectedRoute role="FARMER"><Mycrops /></ProtectedRoute>} />
        <Route path="/farmer/orders" element={<ProtectedRoute role="FARMER"><FarmerOrders /></ProtectedRoute>} />

        <Route path="/farmer/ai-advisor" element={<ProtectedRoute role="FARMER"><AIAdvisor /></ProtectedRoute>} />

        {/* CUSTOMER */}
        <Route path="/customer/dashboard" element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/products" element={<ProtectedRoute role="CUSTOMER"><Products /></ProtectedRoute>} />
        <Route path="/customer/cart" element={<ProtectedRoute role="CUSTOMER"><Cart /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute role="CUSTOMER"><MyOrders /></ProtectedRoute>} />
        <Route path="/customer/orders/:id" element={<ProtectedRoute role="CUSTOMER"><OrderDetails /></ProtectedRoute>} />
        <Route path="/customer/profile" element={<ProtectedRoute role="CUSTOMER"><Profile /></ProtectedRoute>} />
 
        {/* DISTRIBUTOR */}
         {/* Distributor Routes */}
<<<<<<< HEAD
        <Route path="/distributor" element={<ProtectedRoute role="DISTRIBUTOR">
                                                          <DistributorLayout />
                                                        </ProtectedRoute>}>
=======
        <Route path="/distributor" element={<DistributorLayout />}>
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
          <Route index element={<DistributorDashboard />} />
          <Route path="dashboard" element={<DistributorDashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="orders" element={<DistributorOrders></DistributorOrders>} />
          <Route path="suppliers" element={<DistributorSuppliers></DistributorSuppliers>} />
        </Route>


        {/* ADMIN */}
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:uniqueId" element={<UserDetails />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          
        </Route>

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
