import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFlightDetail, createPaymentIntent, confirmPayment } from "../services/api";
import "../styles/payment.css";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    passengerCount: 1,
    passengerNames: []
  });

  const flightId = searchParams.get("flight");
  const seatClass = searchParams.get("seat") || "Economy";

  useEffect(() => {
    const loadFlight = async () => {
      try {
        if (flightId) {
          const res = await fetchFlightDetail(flightId);
          setFlight(res.data);
        }
      } catch (error) {
        console.error("Error loading flight:", error);
        alert("Failed to load flight details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadFlight();
  }, [flightId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!flight) return 0;
    const basePrice = flight.price;
    let seatMultiplier = 1;
    switch (seatClass) {
      case "Business":
        seatMultiplier = 1.5;
        break;
      case "Regular":
        seatMultiplier = 1.2;
        break;
      default:
        seatMultiplier = 1;
    }
    return basePrice * seatMultiplier * formData.passengerCount;
  };

  const handlePassengerCountChange = (count) => {
    const newCount = Math.max(1, Math.min(9, count)); // Limit between 1-9 passengers
    setFormData(prev => ({
      ...prev,
      passengerCount: newCount,
      passengerNames: Array(newCount).fill('').map((_, index) => 
        prev.passengerNames[index] || ''
      )
    }));
  };

  const handlePassengerNameChange = (index, name) => {
    setFormData(prev => ({
      ...prev,
      passengerNames: prev.passengerNames.map((n, i) => i === index ? name : n)
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // First, create payment intent
      const paymentIntent = await createPaymentIntent({
        amount: calculateTotal(),
        currency: 'usd',
        flight_id: flightId,
        seat_class: seatClass,
        passenger_count: formData.passengerCount
      });
      
      console.log('Payment Intent Created:', paymentIntent.data);
      
      // Simulate successful payment (in real app, you'd use Stripe Elements)
      // For demo purposes, we'll confirm the payment immediately
      const confirmResult = await confirmPayment({
        payment_intent_id: paymentIntent.data.payment_intent_id,
        flight_id: flightId,
        seat_class: seatClass,
        passenger_count: formData.passengerCount,
        amount: calculateTotal(),
        passenger_names: formData.passengerNames
      });
      
      console.log('Payment Confirmed:', confirmResult.data);
      
      // Redirect to success page with booking details
      navigate(`/booking-success?flight=${flightId}&seat=${seatClass}&total=${calculateTotal()}&booking=${confirmResult.data.booking_id}&passengers=${formData.passengerCount}&passengerNames=${encodeURIComponent(JSON.stringify(formData.passengerNames))}`);
      
    } catch (error) {
      console.error("Payment failed:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "Unknown error occurred";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again.";
        // Clear token and redirect to login
        localStorage.removeItem("accessToken");
        navigate("/login");
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || "Invalid payment data";
      } else if (error.response?.status === 403) {
        errorMessage = "Your account is not approved yet. Please contact admin.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert("Payment failed. Please try again. Error: " + errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <h2>Flight not found</h2>
          <p>The flight you're trying to book is no longer available.</p>
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Complete Your Payment</h2>
          <p>Secure payment powered by Stripe</p>
        </div>

        <div className="payment-content">
          {/* Flight Summary */}
          <div className="flight-summary">
            <h3>Flight Details</h3>
            <div className="summary-card">
              <div className="airline-info">
                <h4>{flight.airline} - {flight.flight_number}</h4>
                <span className="status-badge">{flight.status}</span>
              </div>
              <div className="route-info">
                <div className="airport">
                  <span className="code">{flight.origin}</span>
                  <span className="time">
                    {new Date(flight.departure_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                <div className="arrow">→</div>
                <div className="airport">
                  <span className="code">{flight.destination}</span>
                  <span className="time">
                    {new Date(flight.arrival_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
              <div className="date-info">
                <p>{new Date(flight.departure_time).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-section">
            <h3>Payment Information</h3>
            <form onSubmit={handlePayment} className="payment-form">
              {/* Personal Information */}
              <div className="form-section">
                <h4>Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Passenger Information */}
              <div className="form-section">
                <h4>Passenger Information</h4>
                <div className="form-group">
                  <label>Number of Passengers *</label>
                  <div className="passenger-count-controls">
                    <button 
                      type="button" 
                      onClick={() => handlePassengerCountChange(formData.passengerCount - 1)}
                      disabled={formData.passengerCount <= 1}
                      className="count-btn"
                    >
                      -
                    </button>
                    <span className="passenger-count">{formData.passengerCount}</span>
                    <button 
                      type="button" 
                      onClick={() => handlePassengerCountChange(formData.passengerCount + 1)}
                      disabled={formData.passengerCount >= 9}
                      className="count-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {formData.passengerNames.map((name, index) => (
                  <div key={index} className="form-group">
                    <label>Passenger {index + 1} Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                      placeholder={`Enter passenger ${index + 1} full name`}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Payment Information */}
              <div className="form-section">
                <h4>Payment Details</h4>
                <div className="form-group">
                  <label>Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="form-section">
                <h4>Billing Address</h4>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <h4>Price Summary</h4>
                <div className="price-breakdown">
                  <div className="price-item">
                    <span>Base Price (per passenger):</span>
                    <span>${flight.price}</span>
                  </div>
                  <div className="price-item">
                    <span>Seat Class ({seatClass}):</span>
                    <span>
                      {seatClass === "Economy" ? "$0" : 
                       seatClass === "Business" ? `+$${(flight.price * 0.5).toFixed(2)}` :
                       `+$${(flight.price * 0.2).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="price-item">
                    <span>Passengers ({formData.passengerCount}):</span>
                    <span>×{formData.passengerCount}</span>
                  </div>
                  <div className="price-item total">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="pay-button"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="spinner"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Pay $${calculateTotal().toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
