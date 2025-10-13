import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFlightDetail } from "../services/api";
import "../styles/bookingSuccess.css";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const flightId = searchParams.get("flight");
  const seatClass = searchParams.get("seat");
  const total = searchParams.get("total");
  const bookingId = searchParams.get("booking") || `AB${Date.now()}`;
  const passengerCount = searchParams.get("passengers") || "1";
  const passengerNamesParam = searchParams.get("passengerNames");
  const passengerNames = passengerNamesParam ? JSON.parse(decodeURIComponent(passengerNamesParam)) : [];

  useEffect(() => {
    const loadFlight = async () => {
      try {
        if (flightId) {
          const res = await fetchFlightDetail(flightId);
          setFlight(res.data);
        }
      } catch (error) {
        console.error("Error loading flight:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFlight();
  }, [flightId]);

  const generateAndDisplayPDF = () => {
    if (!flight) return;

    // Create a new window for PDF display
    const pdfWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes,resizable=yes');
    
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Ticket - ${bookingId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            background: #f8f9fa;
            padding: 20px;
            line-height: 1.6;
          }
          .pdf-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
          }
          .header p {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 30px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
          }
          .section:last-child {
            border-bottom: none;
          }
          .section h3 {
            color: #1e40af;
            font-size: 1.3rem;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #3b82f6;
            display: inline-block;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-item:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #374151;
          }
          .info-value {
            color: #1e40af;
            font-weight: 500;
          }
          .passenger-list {
            list-style: none;
            margin-top: 10px;
          }
          .passenger-list li {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
          }
          .passenger-list li:last-child {
            border-bottom: none;
          }
          .flight-route {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .airport-info {
            text-align: center;
            flex: 1;
          }
          .airport-code {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e40af;
            display: block;
            margin-bottom: 5px;
          }
          .airport-time {
            font-size: 1.1rem;
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 3px;
          }
          .airport-date {
            font-size: 0.9rem;
            color: #6b7280;
          }
          .route-arrow {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 20px;
          }
          .arrow-line {
            width: 60px;
            height: 2px;
            background: #3b82f6;
            position: relative;
            margin-bottom: 8px;
          }
          .arrow-line::after {
            content: '';
            position: absolute;
            right: -6px;
            top: -4px;
            width: 0;
            height: 0;
            border-left: 8px solid #3b82f6;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }
          .duration {
            font-size: 0.9rem;
            color: #6b7280;
            font-weight: 600;
          }
          .footer {
            background: #f8fafc;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer h4 {
            color: #1e40af;
            margin-bottom: 10px;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
            flex-wrap: wrap;
          }
          .contact-item {
            color: #6b7280;
            font-size: 0.9rem;
          }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
          }
          .print-btn:hover {
            background: #059669;
            transform: translateY(-2px);
          }
          @media print {
            body { background: white; padding: 0; }
            .print-btn { display: none; }
            .pdf-container { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print PDF</button>
        
        <div class="pdf-container">
          <div class="header">
            <h1>✈️ AirBooking E-Ticket</h1>
            <p>Booking ID: ${bookingId} | Issue Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>👥 Passenger Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Total Passengers:</span>
                  <span class="info-value">${passengerCount}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Booking Status:</span>
                  <span class="info-value" style="color: #10b981; font-weight: 600;">✅ Confirmed</span>
                </div>
              </div>
              ${passengerNames.length > 0 ? `
                <ul class="passenger-list">
                  ${passengerNames.map((name, index) => `
                    <li><strong>Passenger ${index + 1}:</strong> ${name}</li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
            
            <div class="section">
              <h3>✈️ Flight Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Airline:</span>
                  <span class="info-value">${flight.airline}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Flight Number:</span>
                  <span class="info-value">${flight.flight_number}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Seat Class:</span>
                  <span class="info-value">${seatClass}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <span class="info-value" style="color: #10b981;">On Time</span>
                </div>
              </div>
              
              <div class="flight-route">
                <div class="airport-info">
                  <span class="airport-code">${flight.origin}</span>
                  <span class="airport-time">${new Date(flight.departure_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                  <span class="airport-date">${new Date(flight.departure_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <div class="route-arrow">
                  <div class="arrow-line"></div>
                  <span class="duration">${Math.round((new Date(flight.arrival_time) - new Date(flight.departure_time)) / (1000 * 60 * 60))}h</span>
                </div>
                
                <div class="airport-info">
                  <span class="airport-code">${flight.destination}</span>
                  <span class="airport-time">${new Date(flight.arrival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                  <span class="airport-date">${new Date(flight.arrival_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>💳 Payment Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Total Amount:</span>
                  <span class="info-value" style="font-size: 1.2rem; font-weight: 700; color: #10b981;">$${total}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Payment Status:</span>
                  <span class="info-value" style="color: #10b981; font-weight: 600;">✅ Completed</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Payment Method:</span>
                  <span class="info-value">Credit Card</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Transaction ID:</span>
                  <span class="info-value">${bookingId}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <h4>📋 Important Notes</h4>
            <p style="margin: 10px 0; color: #6b7280;">
              • Please arrive at the airport 2 hours before departure<br>
              • Bring a valid ID and this e-ticket<br>
              • Check-in online 24 hours before departure<br>
              • For any changes, contact customer service
            </p>
            <div class="contact-info">
              <span class="contact-item">📞 +1 (555) 123-4567</span>
              <span class="contact-item">✉️ support@airbooking.com</span>
            </div>
            <p style="margin-top: 15px; color: #1e40af; font-weight: 600;">
              Thank you for choosing AirBooking! 🛫
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();
  };


  if (loading) {
    return (
      <div className="success-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Booking Confirmed!</h1>
          <p>Your flight has been successfully booked</p>
        </div>

        <div className="booking-details">
          <div className="booking-card">
            <div className="booking-header">
              <h3>Booking Information</h3>
              <span className="booking-id">#{bookingId}</span>
            </div>
            
            {flight && (
              <div className="flight-info">
                <div className="airline-info">
                  <h4>{flight.airline} - {flight.flight_number}</h4>
                  <span className="status confirmed">Confirmed</span>
                </div>
                
                <div className="route-details">
                  <div className="airport">
                    <span className="code">{flight.origin}</span>
                    <span className="time">
                      {new Date(flight.departure_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className="date">
                      {new Date(flight.departure_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flight-arrow">
                    <div className="arrow-line"></div>
                    <span className="duration">
                      {Math.round((new Date(flight.arrival_time) - new Date(flight.departure_time)) / (1000 * 60 * 60))}h
                    </span>
                  </div>
                  
                  <div className="airport">
                    <span className="code">{flight.destination}</span>
                    <span className="time">
                      {new Date(flight.arrival_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className="date">
                      {new Date(flight.arrival_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="seat-info">
                  <span>Seat Class: <strong>{seatClass}</strong></span>
                  <span>Passengers: <strong>{passengerCount}</strong></span>
                  <span>Total Paid: <strong>${total}</strong></span>
                </div>
                
                {passengerNames.length > 0 && (
                  <div className="passenger-info">
                    <h4>Passenger Names:</h4>
                    <ul className="passenger-list">
                      {passengerNames.map((name, index) => (
                        <li key={index}>Passenger {index + 1}: <strong>{name}</strong></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-list">
              <div className="step">
                <div className="step-icon">📧</div>
                <div className="step-content">
                  <h4>Check Your Email</h4>
                  <p>We've sent your booking confirmation to your email address.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">📱</div>
                <div className="step-content">
                  <h4>Online Check-in</h4>
                  <p>Check in online 24 hours before your flight departure.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">✈️</div>
                <div className="step-content">
                  <h4>Arrive Early</h4>
                  <p>Please arrive at the airport 2 hours before departure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={generateAndDisplayPDF} className="download-btn">
            📄 View E-Ticket (PDF)
          </button>
          <button onClick={() => navigate("/my-trips")} className="view-trips-btn">
            View My Trips
          </button>
          <button onClick={() => navigate("/dashboard")} className="book-another-btn">
            Book Another Flight
          </button>
        </div>

        <div className="support-info">
          <h3>Need Help?</h3>
          <p>Our customer service team is here to assist you 24/7</p>
          <div className="contact-info">
            <span>📞 +1 (555) 123-4567</span>
            <span>✉️ support@airbooking.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
