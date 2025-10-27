import { InitialState, Reducer } from "@/utils/reducer";
import React,{ createContext,useReducer } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, InitialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};
