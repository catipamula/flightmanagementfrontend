import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
