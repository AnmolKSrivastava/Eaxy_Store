import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI shopping assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple AI-like responses based on keywords
    if (lowerMessage.includes('product') || lowerMessage.includes('phone') || lowerMessage.includes('buy')) {
      return "I can help you find the perfect product! We have a wide range of smartphones, accessories, and electronic devices. Would you like to see our latest deals or specific categories?";
    } else if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('service')) {
      return "We offer professional repair services for smartphones and electronic devices. Our technicians can help with screen replacements, battery issues, water damage, and more. Would you like to schedule a repair?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      return "Our prices are very competitive! Products range from budget-friendly to premium options. Can you tell me which specific product you're interested in?";
    } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return "We offer fast and reliable delivery! Standard shipping takes 3-5 business days, and express shipping is available for 1-2 day delivery. Free shipping on orders over $50!";
    } else if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee')) {
      return "All our products come with a manufacturer's warranty, and we offer extended warranty options. Repairs also include a 90-day guarantee on parts and labor.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Great to see you! I'm here to help with any questions about our products, services, or your order. What can I assist you with?";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! If you need anything else, I'm always here to help. Happy shopping! 😊";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return "You can reach our support team at support@eaxystore.com or call us at 1-800-EAXY-STORE. We're available Monday-Friday, 9 AM - 6 PM EST.";
    } else {
      return "I'm here to help! I can assist you with product recommendations, repair services, order tracking, pricing, and more. What would you like to know?";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const quickActions = [
    { label: 'Browse Products', action: 'Show me your products' },
    { label: 'Repair Services', action: 'Tell me about repair services' },
    { label: 'Track Order', action: 'How do I track my order?' },
    { label: 'Contact Support', action: 'How can I contact support?' }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={toggleChat}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="chatbot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="chatbot-input"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="chatbot-send-btn"
              disabled={isTyping || inputMessage.trim() === ''}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10L18 2L11 18L9 11L2 10Z" fill="currentColor"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM7 9H17V11H7V9ZM13 14H7V12H13V14ZM17 8H7V6H17V8Z" fill="currentColor"/>
          </svg>
        )}
        {!isOpen && <span className="chatbot-notification-badge">1</span>}
      </button>
    </div>
  );
};

export default Chatbot;
