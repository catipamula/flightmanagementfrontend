import React, { useState } from "react";
import "../styles/home.css";  

export default function Home() {
  
  const [tripType, setTripType] = useState("roundtrip");

  const deals = [
    { destination: "Paris", price: "$399", dates: "Oct 15-20", airline: "Air France" },
    { destination: "New York", price: "$450", dates: "Nov 1-7", airline: "Delta" },
    { destination: "Tokyo", price: "$700", dates: "Dec 5-12", airline: "Japan Airlines" },
  ];

  const destinations = ["London", "Dubai", "Sydney", "Barcelona", "Singapore", "Kerala", ];

  const steps = ["Search flights", "Choose the best option", "Pay securely", "Get your e-ticket instantly"];
  

  const reviews = [
    { name: "Alice Johnson", text: "Easy booking and great deals! The flight management system is so user-friendly.", rating: 5 },
    { name: "Bob Smith", text: "Loved the website design and the seamless booking experience.", rating: 4 },
    { name: "Charlie Brown", text: "Fast and reliable service. Best flight booking platform I've used!", rating: 5 },
    { name: "Diana Prince", text: "Excellent customer support and amazing flight options.", rating: 5 },
    { name: "Ethan Hunt", text: "The real-time flight tracking feature is incredible!", rating: 4 },
  ];

  const features = [
    { icon: "✈️", title: "Flight Search", description: "Find the best flights with our advanced search engine" },
    { icon: "🎫", title: "Easy Booking", description: "Book your flights in just a few simple steps" },
    { icon: "📱", title: "Mobile App", description: "Manage your bookings on the go with our mobile app" },
    { icon: "🛡️", title: "Secure Payment", description: "Your payments are protected with bank-level security" },
    { icon: "📞", title: "24/7 Support", description: "Get help anytime with our round-the-clock customer service" },
    { icon: "🏆", title: "Best Prices", description: "We guarantee the best prices or we'll match them" },
  ];

  const stats = [
    { number: "1M+", label: "Happy Customers" },
    { number: "500+", label: "Airlines Partnered" },
    { number: "10K+", label: "Daily Bookings" },
    { number: "99.9%", label: "Uptime Guarantee" },
  ];

  return (
    <div className="home">
      {/* Hero / Flight Search */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>AirBooking Flight Management System</h1>
          <p>Your trusted partner for seamless flight booking and management. Find the best deals for your next adventure with our advanced flight search engine.</p>
          <div className="flight-form">
            <div className="trip-type">
              <label>
                <input
                  type="radio"
                  name="trip"
                  value="oneway"
                  checked={tripType === "oneway"}
                  onChange={() => setTripType("oneway")}
                />{" "}
                One-way
              </label>
              <label>
                <input
                  type="radio"
                  name="trip"
                  value="roundtrip"
                  checked={tripType === "roundtrip"}
                  onChange={() => setTripType("roundtrip")}
                />{" "}
                Round-trip
              </label>
            </div>
            <input type="text" placeholder="From (City or Airport)" />
            <input type="text" placeholder="To (City or Airport)" />
            <input type="date" />
            {tripType === "roundtrip" && <input type="date" />}
            <select>
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>3 Adults</option>
            </select>
            <select>
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
            <button className="search-btn">Search Flights</button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose AirBooking?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="deals">
        <h2>Featured Deals</h2>
        <div className="deals-container">
          {deals.map((deal, index) => (
            <div className="deal-card" key={index}>
              <h3>{deal.destination}</h3>
              <p>{deal.airline}</p>
              <p>{deal.dates}</p>
              <p className="price">{deal.price}</p>
              <button>Book Now</button>
            </div>
          ))}
        </div>
      </section>

{/* Popular Destinations */}
<section className="destinations">
  <h2>Popular Destinations</h2>
  <div className="destinations-grid">
    {destinations.map((city, index) => {
      // Map city names to live images
      const cityImages = {
        Kerala : "https://images.pexels.com/photos/18965987/pexels-photo-18965987.jpeg", 
        London: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80",
        Dubai: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg",
        Sydney: "https://images.pexels.com/photos/2368880/pexels-photo-2368880.jpeg",
        Barcelona: "https://images.pexels.com/photos/1782436/pexels-photo-1782436.jpeg",
        Singapore: "https://images.pexels.com/photos/326699/pexels-photo-326699.jpeg"
      };

      return (
        <div className="destination-card" key={index}>
          <img
            src={cityImages[city]}
            alt={city}
          />
          <h3>{city}</h3>
          <p>Starting from $299</p>
        </div>
      );
    })}
  </div>
</section>


      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-number">{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-cards">
          {reviews.map((review, index) => (
            <div className="testimonial-card" key={index}>
              <p>"{review.text}"</p>
              <h4>{review.name}</h4>
              <p>{"⭐".repeat(review.rating)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Subscribe for Latest Deals</h2>
        <p>Get flight deals and travel tips directly to your inbox.</p>
        <div className="subscribe-form">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </section>

{/* Contact Section */}
<section className="contact">
  <div className="contact-container">
    {/* Contact Info */}
    <div className="contact-info">
      <h2>Get in Touch</h2>
      <p>Have questions about our flight management system? We're here to help!</p>
      
      <div className="contact-details">
        <div className="contact-item">
          <div className="contact-icon">📞</div>
          <div>
            <h4>Phone Support</h4>
            <p>+1 (555) 123-4567</p>
            <p>24/7 Customer Service</p>
          </div>
        </div>
        
        <div className="contact-item">
          <div className="contact-icon">✉️</div>
          <div>
            <h4>Email Support</h4>
            <p>support@airbooking.com</p>
            <p>Response within 2 hours</p>
          </div>
        </div>
        

      </div>
    </div>
    
    {/* Contact Form */}
    <div className="contact-form">
      <h3>Send us a Message</h3>
      <form
        action="https://formspree.io/f/mdkdjazd" // <-- replace with your Formspree endpoint
        method="POST"
      >
        <div className="form-group">
          <input type="text" name="name" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <input type="text" name="subject" placeholder="Subject" required />
        </div>
        <div className="form-group">
          <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
        </div>
        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>AirBooking</h4>
            <p>Your trusted flight management system for seamless travel experiences.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <span>About Us</span>
              <span>Contact</span>
              <span>FAQs</span>
              <span>Privacy Policy</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>Services</h4>
            <div className="footer-links">
              <span>Flight Booking</span>
              <span>Hotel Booking</span>
              <span>Car Rental</span>
              <span>Travel Insurance</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <span>Facebook</span>
              <span>Twitter</span>
              <span>Instagram</span>
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AirBooking Flight Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
