import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthWrapper from "./components/AuthWrapper";
import Unavailable from "./pages/Unavailable/Unavailable";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import Login from "./pages/Login";

function Router() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default Router;
