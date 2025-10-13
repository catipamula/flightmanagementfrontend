import React, { useEffect, useState } from "react";
import { fetchMyTrips } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/mytrips.css";

export default function MyTrips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        console.log("Fetching bookings...");
        const res = await fetchMyTrips();
        console.log("Bookings response:", res);
        setBookings(res.data || []);
      } catch (error) {
        console.error("Error loading bookings:", error);
        console.error("Error details:", error.response?.data);
        console.error("Error status:", error.response?.status);
        
        // More specific error messages
        if (error.response?.status === 401) {
          alert("Authentication required. Please login first.");
        } else if (error.response?.status === 403) {
          alert("Your account is not approved yet. Please contact admin.");
        } else if (error.response?.status === 404) {
          alert("API endpoint not found. Please check server configuration.");
        } else {
          alert(`Failed to load your trips: ${error.response?.data?.detail || error.message || "Unknown error"}`);
        }
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    if (filter === "upcoming") {
      return new Date(booking.flight_details.departure_time) > new Date();
    }
    if (filter === "completed") {
      return new Date(booking.flight_details.departure_time) <= new Date();
    }
    return booking.payment_status.toLowerCase() === filter;
  });

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#10b981';
      case 'Pending':
        return '#f59e0b';
      case 'Failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getFlightStatusColor = (status) => {
    switch (status) {
      case 'On Time':
        return '#10b981';
      case 'Delayed':
        return '#f59e0b';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const downloadETicket = (booking) => {
    const eTicketContent = `
      AIRBOOKING E-TICKET
      ===================
      
      Booking ID: AB${booking.id}
      Issue Date: ${new Date().toLocaleDateString()}
      
      FLIGHT INFORMATION
      ------------------
      Airline: ${booking.flight_details.airline}
      Flight Number: ${booking.flight_details.flight_number}
      Route: ${booking.flight_details.origin} → ${booking.flight_details.destination}
      
      Departure:
      Date: ${formatDate(booking.flight_details.departure_time)}
      Time: ${formatTime(booking.flight_details.departure_time)}
      Airport: ${booking.flight_details.origin}
      
      Arrival:
      Date: ${formatDate(booking.flight_details.arrival_time)}
      Time: ${formatTime(booking.flight_details.arrival_time)}
      Airport: ${booking.flight_details.destination}
      
      SEAT INFORMATION
      ----------------
      Seat Class: ${booking.seat_class}
      Status: ${booking.payment_status}
      
      PAYMENT INFORMATION
      -------------------
      Payment Status: ${booking.payment_status}
      Booking Date: ${formatDate(booking.booking_date)}
      
      Thank you for choosing AirBooking!
    `;

    const blob = new Blob([eTicketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `e-ticket-AB${booking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mytrips-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mytrips-page">
      <div className="mytrips-header">
        <h2>My Trips</h2>
        <p>Manage your flight bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Trips ({bookings.length})
        </button>
        <button 
          className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming ({bookings.filter(b => new Date(b.flight_details.departure_time) > new Date()).length})
        </button>
        <button 
          className={`filter-tab ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed ({bookings.filter(b => new Date(b.flight_details.departure_time) <= new Date()).length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-container">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">✈️</div>
            <h3>No trips found</h3>
            <p>
              {filter === "all" 
                ? "You haven't made any bookings yet." 
                : `No ${filter} trips found.`}
            </p>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="book-flight-btn"
            >
              Book Your First Flight
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-info">
                  <h3>{booking.flight_details.airline} - {booking.flight_details.flight_number}</h3>
                  <span className="booking-id">Booking #AB{booking.id}</span>
                </div>
                <div className="status-badges">
                  <span 
                    className="payment-status"
                    style={{ backgroundColor: getStatusColor(booking.payment_status) }}
                  >
                    {booking.payment_status}
                  </span>
                  <span 
                    className="flight-status"
                    style={{ backgroundColor: getFlightStatusColor(booking.flight_details.status) }}
                  >
                    {booking.flight_details.status}
                  </span>
                </div>
              </div>

              <div className="flight-details">
                <div className="route-info">
                  <div className="airport">
                    <span className="code">{booking.flight_details.origin}</span>
                    <span className="time">{formatTime(booking.flight_details.departure_time)}</span>
                    <span className="date">{formatDate(booking.flight_details.departure_time)}</span>
                  </div>
                  
                  <div className="flight-arrow">
                    <div className="arrow-line"></div>
                    <span className="duration">
                      {Math.round((new Date(booking.flight_details.arrival_time) - new Date(booking.flight_details.departure_time)) / (1000 * 60 * 60))}h
                    </span>
                  </div>
                  
                  <div className="airport">
                    <span className="code">{booking.flight_details.destination}</span>
                    <span className="time">{formatTime(booking.flight_details.arrival_time)}</span>
                    <span className="date">{formatDate(booking.flight_details.arrival_time)}</span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Seat Class:</span>
                    <span className="value">{booking.seat_class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Passengers:</span>
                    <span className="value">{booking.passenger_count || 1}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Booking Date:</span>
                    <span className="value">{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Paid:</span>
                    <span className="value">${booking.amount_paid || booking.flight_details.price}</span>
                  </div>
                </div>
              </div>

              <div className="booking-actions">
                <button 
                  onClick={() => downloadETicket(booking)}
                  className="action-btn download"
                >
                  📄 Download E-Ticket
                </button>
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="action-btn book-another"
                >
                  Book Another Flight
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
