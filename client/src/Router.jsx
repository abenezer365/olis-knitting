import React from "react";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Story from "./pages/Story";
import Products from "./pages/Products";
import ProductsDetail from "./pages/ProductsDetail";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard/Dashboard";
import PlaceOrder from "./pages/PlaceOrder";
import OrderConfirmation from "./pages/OrderConfirmation";

function Router() {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/dashboard") || location.pathname === "/auth";
  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductsDetail />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Router;
