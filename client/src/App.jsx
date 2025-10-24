import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Story from "./pages/Story";
import Products from "./pages/Products";
import ProductsDetail from "./pages/ProductsDetail";
import ContactUs from "./pages/ContactUs";
import { CartProvider } from "./contexts/CartContext";
import Dashboard from './Pages/Dashboard/Dashboard'

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductsDetail />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path='/dashboard/*' element={<Dashboard />}/>   
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
