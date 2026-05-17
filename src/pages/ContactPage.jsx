import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 1800-123-4567', '+91 98765-43210'],
      subtitle: 'Mon-Sat: 9 AM - 9 PM',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@eaxystore.com', 'sales@eaxystore.com'],
      subtitle: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Tech Plaza, Baner Road', 'Pune, Maharashtra 411045'],
      subtitle: 'Mon-Sat: 10 AM - 8 PM',
    },
  ];

  const faqs = [
    {
      question: 'What are your delivery timings?',
      answer: 'We offer express delivery within 4 hours across all coverage areas in Pune. Orders placed before 6 PM are delivered the same day.',
    },
    {
      question: 'Do you provide warranty on products?',
      answer: 'Yes! All our products come with manufacturer warranty. Refurbished products have a 6-month warranty, and repairs come with a 3-12 month warranty.',
    },
    {
      question: 'Can I track my repair status?',
      answer: 'Absolutely! Once you book a repair service, you\'ll receive a tracking ID to monitor the status in real-time through our website or via SMS updates.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery for orders above ₹1,000.',
    },
  ];

  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content reveal">
            <h1>Contact Us</h1>
            <p>Have questions? We're here to help! Reach out and we'll respond as soon as possible.</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section contact-form-section">
        <div className="container">
          <div className="contact-layout reveal">
            {/* Form */}
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours</p>
              </div>

              {isSubmitted ? (
                <div className="success-message">
                  <CheckCircle size={48} />
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765-43210"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="product">Product Inquiry</option>
                        <option value="repair">Repair Service</option>
                        <option value="order">Order Status</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Business Hours & Map */}
            <div className="contact-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-icon">
                  <Clock size={24} />
                </div>
                <h3>Business Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span>Monday - Friday</span>
                    <span className="time">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Saturday</span>
                    <span className="time">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Sunday</span>
                    <span className="time">Closed</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card">
                <div className="sidebar-icon">
                  <MapPin size={24} />
                </div>
                <h3>Our Locations</h3>
                <div className="locations-list">
                  <div className="location-item">
                    <strong>Main Store - Baner</strong>
                    <p>123 Tech Plaza, Baner Road, Pune 411045</p>
                  </div>
                  <div className="location-item">
                    <strong>Service Center - Kothrud</strong>
                    <p>45 Service Lane, Kothrud, Pune 411038</p>
                  </div>
                  <div className="location-item">
                    <strong>Outlet - Hinjewadi</strong>
                    <p>78 IT Park, Hinjewadi Phase 2, Pune 411057</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section contact-info-section">
        <div className="container">
          <div className="contact-info-grid reveal">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="contact-info-card">
                  <div className="info-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{info.title}</h3>
                  <div className="info-details">
                    {info.details.map((detail, idx) => (
                      <p key={idx}>{detail}</p>
                    ))}
                  </div>
                  <p className="info-subtitle">{info.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about our products and services</p>
          </div>
          <div className="faq-grid reveal">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box reveal">
            <h2>Need Immediate Assistance?</h2>
            <p>Our customer support team is available to help you right now</p>
            <div className="cta-actions">
              <a href="tel:+918001234567" className="btn btn-primary btn-lg">
                <Phone size={18} />
                Call Now
              </a>
              <button className="btn btn-secondary btn-lg">
                <Mail size={18} />
                Email Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactPage;
