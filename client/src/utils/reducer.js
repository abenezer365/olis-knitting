import { Type } from "./action.type";
import { toast } from "sonner";

export const InitialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

export const Reducer = (state, action) => {
  switch (action.type) {
    case Type.ADD_TO_CART: {
      if (!action.payload) return state; // <--- safe guard

      const existingItem = state.cart.find(
        (i) =>
          i.id === action.payload.id &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );

      let updatedCart;
      if (existingItem) {
        toast.success("Updated cart quantity");
        updatedCart = state.cart.map((item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item
        );
      } else {
        toast.success("Added to cart");
        updatedCart = [
          ...state.cart,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };
    }

    case Type.REMOVE_FROM_CART: {
      // support payload being either an id (primitive) or an object { id, color, size }
      const payload = action.payload;
      let updatedCart;
      if (payload && typeof payload === "object") {
        updatedCart = state.cart.filter(
          (item) =>
            !(
              item.id === payload.id &&
              (payload.color ? item.color === payload.color : true) &&
              (payload.size ? item.size === payload.size : true)
            )
        );
      } else {
        updatedCart = state.cart.filter((item) => item.id !== payload);
      }

      toast.success("Removed from cart");
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };
    }

    case Type.UPDATE_QUANTITY: {
      if (!action.payload) return state; // <--- safe guard

      // payload may be { id, quantity } or { id, quantity, color, size }
      const { id, quantity, color, size } = action.payload;
      const updatedCart = state.cart.map((item) =>
        item.id === id &&
        (color ? item.color === color : true) &&
        (size ? item.size === size : true)
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };
    }

    case Type.CLEAR_CART: {
      localStorage.removeItem("cart");
      return { ...state, cart: [] };
    }

    case Type.SET_USER: {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    }

    case Type.CLEAR_USER: {
      localStorage.removeItem("user");
      return { ...state, user: null };
    }

    default:
      return state;
  }
};
