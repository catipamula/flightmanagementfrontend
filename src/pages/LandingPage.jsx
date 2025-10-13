import React, { useEffect, useState } from "react";
import { fetchFlights } from "../services/api";
import FlightCard from "../components/FlightCard";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFlights().then((res) => setFlights(res.data));
  }, []);

  const filteredFlights = flights.filter(
    (f) =>
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      f.origin.toLowerCase().includes(search.toLowerCase()) ||
      f.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Fly Smarter with AirBooking</h1>
          <p className="hero-subtitle">
            Discover affordable flights and seamless travel experiences.
          </p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by airline, origin, or destination"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>

      {/* Flights Section */}
      <section className="flights-section">
        <h2 className="section-title">Available Flights</h2>
        {filteredFlights.length === 0 ? (
          <p className="no-flights">No flights found.</p>
        ) : (
          <div className="flights-grid">
            {filteredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2025 AirBooking. All rights reserved.</p>
      </footer>
    </div>
  );
}
