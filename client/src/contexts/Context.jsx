import React, { createContext, useContext, useReducer, useEffect } from "react";
import { InitialState, Reducer } from "@/utils/reducer";
import { Type } from "@/utils/action.type";
import axios from "@/utils/axios.instance";

export const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, InitialState);

  // ---- CART ACTIONS ----
  const addToCart = (item) =>
    dispatch({ type: Type.ADD_TO_CART, payload: item });
  const removeFromCart = (idOrPayload) =>
    dispatch({ type: Type.REMOVE_FROM_CART, payload: idOrPayload });
  // support optional color & size so we can update a specific variant
  const updateQuantity = (id, quantity, color, size) =>
    dispatch({
      type: Type.UPDATE_QUANTITY,
      payload: { id, quantity, color, size },
    });
  const clearCart = () => dispatch({ type: Type.CLEAR_CART });

  // ---- USER ACTIONS ----
  const setUser = (user) => dispatch({ type: Type.SET_USER, payload: user });
  const clearUser = () => dispatch({ type: Type.EMPTY_USER });

  // ---- DERIVED VALUES ----
  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    user: state.user,
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setUser,
    clearUser,
    total,
    itemCount,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function validateToken() {
      try {
        const res = await axios.get("/auth/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.valid) {
          // token valid → update user in context
          setUser(res.data.user);
        } else {
          // invalid token → clear everything
          localStorage.removeItem("token");
          clearUser();
        }
      } catch {
        localStorage.removeItem("token");
        clearUser();
      }
    }

    // Check immediately
    validateToken();

    // Check again every 24 hours
    const interval = setInterval(validateToken, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within ContextProvider");
  return context;
};
