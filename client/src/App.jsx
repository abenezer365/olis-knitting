import React from "react";
import Router from "./Router";
import { ContextProvider } from "./contexts/Context";
import { Toaster } from "@/components/ui/sonner";
function App() {
  return (
    <>
      <ContextProvider>
        <Toaster />
        <Router />
      </ContextProvider>
    </>
  );
}

export default App;
