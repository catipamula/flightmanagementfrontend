import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const token = localStorage.getItem("accessToken");

  return (
    <nav className="navbar">
      <div className="nav-left">
      <Link to="/" className="nav-logo">
  <img
    src="https://www.goindigo.in/content/dam/s6web/in/en/assets/logo/IndiGo_logo_2x.png" 
    alt="AirBooking Logo"
    className="logo"
  />
  <span className="logo-text"></span>
</Link>

      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-trips">My Trips</Link>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
