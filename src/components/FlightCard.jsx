import React from "react";
import "./FlightCard.css";

export default function FlightCard({ flight, onSelect, isSelected }) {
  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
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

  return (
    <div className={`flight-row ${isSelected ? 'selected' : ''}`}>
      {/* Airline & Status */}
      <div className="flight-airline">
        <h3>{flight.airline}</h3>
        <p className="flight-number">{flight.flight_number}</p>
        <span 
          className="status-badge" 
          style={{ backgroundColor: getStatusColor(flight.status) }}
        >
          {flight.status}
        </span>
      </div>

      {/* Route Information */}
      <div className="flight-route">
        <div className="departure">
          <span className="airport-code">{flight.origin}</span>
          <span className="time">{formatTime(flight.departure_time)}</span>
          <span className="date">{formatDate(flight.departure_time)}</span>
        </div>
        
        <div className="route-arrow">
          <div className="arrow-line"></div>
          <span className="duration">
            {Math.round((new Date(flight.arrival_time) - new Date(flight.departure_time)) / (1000 * 60 * 60))}h
          </span>
        </div>
        
        <div className="arrival">
          <span className="airport-code">{flight.destination}</span>
          <span className="time">{formatTime(flight.arrival_time)}</span>
          <span className="date">{formatDate(flight.arrival_time)}</span>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flight-price-section">
        <div className="price-info">
          <span className="price-label">From</span>
          <span className="flight-price">${flight.price.toLocaleString()}</span>
        </div>
        
        <button 
          className={`book-btn ${isSelected ? 'selected' : ''}`} 
          onClick={() => onSelect(flight)}
        >
          {isSelected ? 'Selected' : 'Select Flight'}
        </button>
      </div>
    </div>
  );
}
