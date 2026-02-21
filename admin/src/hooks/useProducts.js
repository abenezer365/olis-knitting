// hooks/useProducts.js
import axiosInstance from "@/utils/axios.instance";
import { useState, useEffect } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencyRate, setCurrencyRate] = useState(167); // default rate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/product/getProducts");
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category/categories");
      setCategories(["All", ...response.data.data.map((cat) => cat.name)]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCurrencyRate = async () => {
    try {
      const response = await axiosInstance.get("/currency/rate");
      setCurrencyRate(response.data.rate);
    } catch (err) {
      console.error("Error fetching currency rate:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCurrencyRate();
  }, []);

  return {
    products,
    categories,
    currencyRate,
    loading,
    error,
    refetchProducts: fetchProducts,
  };
};
