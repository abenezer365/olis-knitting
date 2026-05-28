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
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/dashboard/*" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
        <Route path="*" element={<Unavailable />} />
      </Routes>
    </>
  );
}

export default Router;
