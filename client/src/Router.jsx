import React from "react";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Story from "./pages/Story/Story";
import Products from "./pages/Products/Products";
import ProductsDetail from "./pages/Products/ProductsDetail";
import ContactUs from "./pages/ContactUs/ContactUs";
import Dashboard from "./pages/Dashboard/Dashboard";
import PlaceOrder from "./pages/Order/PlaceOrder";
import OrderConfirmation from "./pages/Order/OrderConfirmation";

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
        <Route path="/place_order" element={<PlaceOrder />} />
        <Route
          path="/order_confirmation/:orderId"
          element={<OrderConfirmation />}
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Router;
