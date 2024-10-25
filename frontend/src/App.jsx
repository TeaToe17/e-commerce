import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductPage from "./pages/ProductPage";
import Navbar from "./components/Navbar";
import UserOrders from "./pages/UserOrders";
import { ProductProvider } from "./ProductContext";
import Footer from "./components/Footer";
import VendorLogin from "./pages/CreateConnectedAccount";
import VendorProducts from "./pages/VendorProducts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// Wrapper component for UserOrders with Elements
function UserOrdersWithStripe() {
  return (
    <Elements stripe={stripePromise}>
      <UserOrders />
    </Elements>
  );
}

function App() {
  return (
    <ProductProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/vendor_register" element={<VendorLogin />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product_page/:productId" element={<ProductPage />} />
          <Route path="/vendorproducts" element={<VendorProducts />} />
          <Route path="/user_orders" element={<UserOrdersWithStripe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ProductProvider>
  );
}

export default App;
