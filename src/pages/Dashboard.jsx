import React, { useEffect, useState } from "react";
import { fetchFlights, createBooking } from "../services/api";
import FlightCard from "../components/FlightCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatType, setSeatType] = useState("Economy");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        console.log("Fetching flights...");
        const res = await fetchFlights();
        console.log("Flights response:", res);
        setFlights(res.data || []);
      } catch (error) {
        console.error("Error loading flights:", error);
        console.error("Error details:", error.response?.data);
        console.error("Error status:", error.response?.status);
        
        if (error.response?.status === 401) {
          alert("Authentication required. Please login first.");
        } else if (error.response?.status === 403) {
          alert("Your account is not approved yet. Please contact admin.");
        } else if (error.response?.status === 404) {
          alert("API endpoint not found. Please check server configuration.");
        } else {
          alert(`Failed to load flights: ${error.response?.data?.detail || error.message || "Unknown error"}`);
        }
      } finally {
        setLoading(false);
      }
    };
    loadFlights();
  }, []);

  const handleBook = async () => {
    if (!selectedFlight) return;
    try {
      const data = { flight: selectedFlight.id, seat_class: seatType };
      await createBooking(data);
      alert("Booking successful! Redirecting to payment...");
      window.location.href = `/payment?flight=${selectedFlight.id}&seat=${seatType}`;
    } catch (err) {
      alert("Booking failed! " + (err.response?.data?.detail || "Please try again."));
    }
  };

  // Filter and sort flights
  const filteredFlights = flights
    .filter(flight => {
      const matchesSearch = flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           flight.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === "all" || flight.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "departure":
          return new Date(a.departure_time) - new Date(b.departure_time);
        case "airline":
          return a.airline.localeCompare(b.airline);
        default:
          return 0;
      }
    });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Flight Dashboard</h2>
        <p>Search and book your perfect flight</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search flights by airline, origin, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="price">Sort by Price</option>
            <option value="departure">Sort by Departure</option>
            <option value="airline">Sort by Airline</option>
          </select>
          
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="filter-select">
            <option value="all">All Flights</option>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading flights...</p>
        </div>
      )}

      {/* Flights Grid */}
      {!loading && (
        <div className="flights-section">
          <h3>Available Flights ({filteredFlights.length})</h3>
          <div className="flight-grid">
            {filteredFlights.length === 0 ? (
              <div className="no-flights">
                <p>No flights found matching your criteria.</p>
              </div>
            ) : (
              filteredFlights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight} 
                  onSelect={setSelectedFlight}
                  isSelected={selectedFlight?.id === flight.id}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Booking Section */}
      {selectedFlight && (
        <div className="booking-section">
          <div className="booking-header">
            <h3>Complete Your Booking</h3>
            <button 
              className="close-booking" 
              onClick={() => setSelectedFlight(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="selected-flight-info">
            <div className="flight-summary">
              <h4>{selectedFlight.airline} - {selectedFlight.flight_number}</h4>
              <p>{selectedFlight.origin} → {selectedFlight.destination}</p>
              <p>Departure: {new Date(selectedFlight.departure_time).toLocaleString()}</p>
              <p>Arrival: {new Date(selectedFlight.arrival_time).toLocaleString()}</p>
              <p>Status: <span className={`status ${selectedFlight.status.toLowerCase().replace(' ', '-')}`}>
                {selectedFlight.status}
              </span></p>
            </div>
            
            <div className="booking-form">
              <div className="form-group">
                <label>Seat Class:</label>
                <select 
                  value={seatType} 
                  onChange={(e) => setSeatType(e.target.value)}
                  className="seat-select"
                >
                  <option value="Economy">Economy - ${selectedFlight.price}</option>
                  <option value="Business">Business - ${(selectedFlight.price * 1.5).toFixed(2)}</option>
                  <option value="Regular">Regular - ${(selectedFlight.price * 1.2).toFixed(2)}</option>
                </select>
              </div>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Base Price:</span>
                  <span>${selectedFlight.price}</span>
                </div>
                <div className="price-item">
                  <span>Seat Class:</span>
                  <span>
                    {seatType === "Economy" ? "$0" : 
                     seatType === "Business" ? `+$${(selectedFlight.price * 0.5).toFixed(2)}` :
                     `+$${(selectedFlight.price * 0.2).toFixed(2)}`}
                  </span>
                </div>
                <div className="price-item total">
                  <span>Total:</span>
                  <span>
                    ${seatType === "Economy" ? selectedFlight.price :
                      seatType === "Business" ? (selectedFlight.price * 1.5).toFixed(2) :
                      (selectedFlight.price * 1.2).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button onClick={handleBook} className="book-button">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
