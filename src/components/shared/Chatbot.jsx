import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrder } from '../../firebase/orderService';
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your shopping assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFlow, setCurrentFlow] = useState('main');
  const [awaitingOrderId, setAwaitingOrderId] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Drag functionality for button
  const [buttonPosition, setButtonPosition] = useState({ bottom: 20, right: 20 });
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [buttonDragStart, setButtonDragStart] = useState({ x: 0, y: 0 });
  const [hasButtonMoved, setHasButtonMoved] = useState(false);
  
  // Drag functionality for window
  const [windowPosition, setWindowPosition] = useState({ bottom: 20, right: 20 });
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [windowDragStart, setWindowDragStart] = useState({ x: 0, y: 0 });
  
  const buttonRef = useRef(null);
  const windowRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Button drag handlers
  const handleButtonMouseDown = (e) => {
    e.preventDefault();
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingButton(true);
    setHasButtonMoved(false);
    setButtonDragStart({
      x: clientX,
      y: clientY
    });
  };

  const handleButtonMouseMove = (e) => {
    if (!isDraggingButton) return;
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    const deltaX = buttonDragStart.x - clientX;
    const deltaY = clientY - buttonDragStart.y;
    
    // If movement is detected, mark as dragged
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      setHasButtonMoved(true);
    }
    
    setButtonPosition(prev => ({
      right: prev.right + deltaX,
      bottom: prev.bottom + deltaY
    }));
    
    setButtonDragStart({
      x: clientX,
      y: clientY
    });
  };

  const handleButtonMouseUp = () => {
    setIsDraggingButton(false);
  };

  // Window drag handlers (only drag by header)
  const handleWindowMouseDown = (e) => {
    e.preventDefault();
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingWindow(true);
    setWindowDragStart({
      x: clientX,
      y: clientY
    });
  };

  const handleWindowMouseMove = (e) => {
    if (!isDraggingWindow) return;
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    const deltaX = windowDragStart.x - clientX;
    const deltaY = clientY - windowDragStart.y;
    
    setWindowPosition(prev => ({
      right: prev.right + deltaX,
      bottom: prev.bottom + deltaY
    }));
    
    setWindowDragStart({
      x: clientX,
      y: clientY
    });
  };

  const handleWindowMouseUp = () => {
    setIsDraggingWindow(false);
  };

  // Global mouse and touch event listeners
  useEffect(() => {
    if (isDraggingButton) {
      document.addEventListener('mousemove', handleButtonMouseMove);
      document.addEventListener('mouseup', handleButtonMouseUp);
      document.addEventListener('touchmove', handleButtonMouseMove);
      document.addEventListener('touchend', handleButtonMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleButtonMouseMove);
        document.removeEventListener('mouseup', handleButtonMouseUp);
        document.removeEventListener('touchmove', handleButtonMouseMove);
        document.removeEventListener('touchend', handleButtonMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingButton, buttonDragStart]);

  useEffect(() => {
    if (isDraggingWindow) {
      document.addEventListener('mousemove', handleWindowMouseMove);
      document.addEventListener('mouseup', handleWindowMouseUp);
      document.addEventListener('touchmove', handleWindowMouseMove);
      document.addEventListener('touchend', handleWindowMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleWindowMouseMove);
        document.removeEventListener('mouseup', handleWindowMouseUp);
        document.removeEventListener('touchmove', handleWindowMouseMove);
        document.removeEventListener('touchend', handleWindowMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingWindow, windowDragStart]);

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Order Tracking
    if (lowerMessage.includes('track') || lowerMessage.includes('order status') || lowerMessage.includes('my order')) {
      setAwaitingOrderId(true);
      setCurrentFlow('track_order');
      return "📦 I can help you track your order!\n\nPlease enter your Order ID (format: ORD-XXXXXXXX-XXXXX).\n\nYou can find it in your confirmation email or orders page.";
    }
    
    // Coverage Areas
    if (lowerMessage.includes('coverage') || (lowerMessage.includes('deliver') && lowerMessage.includes('area')) || lowerMessage.includes('location')) {
      setCurrentFlow('coverage');
      return "🗺️ We deliver to these areas in Pune:\n\n• Pimpri-Chinchwad\n• Kothrud & Warje\n• Hadapsar & Magarpatta\n• Shivajinagar & Camp\n• Aundh & Baner\n• Wakad & Hinjewadi\n• Kharadi & Viman Nagar\n• Deccan & FC Road\n• Koregaon Park\n• Katraj & Kondhwa\n• Pashan & Sus\n• Ravet & Moshi\n\nWe guarantee 4-hour delivery to all these zones!";
    }
    
    // 4-Hour Delivery
    if (lowerMessage.includes('4 hour') || lowerMessage.includes('4-hour') || lowerMessage.includes('fast delivery') || lowerMessage.includes('delivery time')) {
      return "⚡ Our 4-Hour Delivery Promise:\n\n✓ Order confirmed within 15 minutes\n✓ Prepared & dispatched in 30 minutes\n✓ Delivered within 4 hours guaranteed\n✓ Available 7 days a week\n✓ Real-time tracking\n✓ Free delivery on orders above ₹5,000\n\nDelivery charges: ₹99 (for orders below ₹5,000)";
    }
    
    // Repair Services
    if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('service')) {
      return "🔧 Our Repair Services:\n\n• Laptop Repair (Screen, Battery, Keyboard)\n• Smartphone Repair (All brands)\n• Computer Hardware Issues\n• Data Recovery\n• Software Installation\n\n⏱️ Most repairs completed same day!\n\nWould you like to book a repair? Type 'book repair' or visit our repair services page.";
    }
    
    // Warranty & Returns
    if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee') || lowerMessage.includes('return')) {
      return "🛡️ Warranty & Returns:\n\n📱 New Products:\n• Manufacturer warranty (6-12 months)\n• 7-day replacement for defects\n• Easy return process\n\n💻 Refurbished Products:\n• 6-month Eaxy Store warranty\n• 7-day testing period\n• Free repairs during warranty\n\n📦 Return within 7 days if product is unused with original packaging. Full refund in 5-7 days.";
    }
    
    // Products
    if (lowerMessage.includes('product') || lowerMessage.includes('phone') || lowerMessage.includes('laptop') || lowerMessage.includes('buy')) {
      return "🛍️ Browse our products:\n\n• Laptops & Computers\n• Smartphones (iPhone, Samsung, OnePlus)\n• Accessories (Headphones, Chargers, Cases)\n• Refurbished Devices\n\nAll with 4-hour delivery! Type 'show products' to browse our catalog.";
    }
    
    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      return "💰 We offer competitive prices across all categories:\n\n• Laptops: ₹25,000 - ₹2,00,000\n• Smartphones: ₹10,000 - ₹1,50,000\n• Accessories: ₹500 - ₹30,000\n• Refurbished: Up to 40% off!\n\nCheck our hot deals for special offers. What product are you interested in?";
    }
    
    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('talk to')) {
      return "📞 Contact Our Support Team:\n\n• 📱 WhatsApp: +91 98765 43210\n• ☎️ Call: 020-1234-5678\n• ✉️ Email: support@eaxystore.com\n• ⏰ Hours: 9 AM - 9 PM (7 days)\n\nFor urgent issues, WhatsApp is the fastest! Type 'whatsapp' to connect now.";
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 Great to see you!\n\nI can help you with:\n• Track orders\n• Check delivery coverage\n• 4-hour delivery info\n• Repair services\n• Product browsing\n• Returns & warranty\n\nWhat would you like to know?";
    }
    
    // Thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! 😊\n\nIf you need anything else, I'm always here to help. Happy shopping!";
    }
    
    // Book Repair
    if (lowerMessage.includes('book repair')) {
      setTimeout(() => {
        navigate('/repair-services');
        setIsOpen(false);
      }, 1500);
      return "Opening repair services page... You can book your repair there!";
    }
    
    // Show Products
    if (lowerMessage.includes('show products') || lowerMessage.includes('browse')) {
      setTimeout(() => {
        navigate('/products');
        setIsOpen(false);
      }, 1500);
      return "Opening products page... Check out our collection!";
    }
    
    // WhatsApp
    if (lowerMessage.includes('whatsapp')) {
      setTimeout(() => {
        window.open('https://wa.me/919876543210', '_blank');
      }, 1000);
      return "Opening WhatsApp... Our team will respond shortly!";
    }
    
    // Default
    return "I'm here to help! I can assist you with:\n\n• Track your order\n• Check delivery coverage\n• 4-hour delivery info\n• Repair services\n• Product browsing\n• Warranty & returns\n• Contact support\n\nJust type what you need or use the quick action buttons below!";
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
    const userInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Handle order tracking flow
    if (awaitingOrderId && currentFlow === 'track_order') {
      try {
        const order = await getOrder(userInput.trim());
        
        if (order) {
          const statusEmoji = {
            pending: '⏳',
            confirmed: '✅',
            processing: '📦',
            shipped: '🚚',
            delivered: '✓',
            cancelled: '❌'
          };

          const aiResponse = {
            id: messages.length + 2,
            text: `${statusEmoji[order.status] || '📦'} Order Found!\n\n` +
                  `Order ID: ${order.orderId}\n` +
                  `Status: ${order.status.toUpperCase()}\n` +
                  `Total: ₹${order.totalAmount}\n` +
                  `Ordered: ${new Date(order.orderDate?.seconds * 1000 || order.orderDate).toLocaleDateString()}\n\n` +
                  `${order.status === 'delivered' ? '✓ Your order has been delivered!' : 
                    order.status === 'shipped' ? '🚚 Your order is on the way!' :
                    '📦 Your order is being processed.'}\n\n` +
                  `Type 'view orders' to see all your orders.`,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiResponse]);
          setAwaitingOrderId(false);
          setCurrentFlow('main');
        } else {
          const aiResponse = {
            id: messages.length + 2,
            text: "❌ Order not found.\n\nPlease check your Order ID and try again. The format should be: ORD-XXXXXXXX-XXXXX\n\nYou can find it in:\n• Confirmation email\n• Orders page\n• SMS notification\n\nType 'contact' if you need help.",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          setAwaitingOrderId(false);
          setCurrentFlow('main');
        }
        setIsTyping(false);
        return;
      } catch (error) {
        const aiResponse = {
          id: messages.length + 2,
          text: "⚠️ Error tracking order. Please try again or contact support.\n\nType 'contact' for support details.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setAwaitingOrderId(false);
        setCurrentFlow('main');
        setIsTyping(false);
        return;
      }
    }

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: generateAIResponse(userInput),
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
    { label: '📦 Track Order', action: 'Track my order' },
    { label: '🗺️ Check Coverage', action: 'Check delivery coverage' },
    { label: '⚡ 4-Hour Delivery', action: '4-hour delivery info' },
    { label: '🔧 Repair Services', action: 'Repair services' },
    { label: '🛡️ Warranty Info', action: 'Warranty and returns' },
    { label: '🛍️ Browse Products', navigate: '/products' },
    { label: '📞 Contact Us', action: 'Contact support' },
    { label: '💬 WhatsApp', action: 'whatsapp' },
  ];

  const handleQuickAction = (action) => {
    if (action.navigate) {
      if (action.navigate.startsWith('http')) {
        window.open(action.navigate, '_blank', 'noopener,noreferrer');
        return;
      }
      setIsOpen(false);
      navigate(action.navigate);
      return;
    }
    if (action.action) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: action.action,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Generate response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: generateAIResponse(action.action),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 500);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={windowRef}
          className="chatbot-window" 
          style={{
            bottom: `${windowPosition.bottom}px`,
            right: `${windowPosition.right}px`,
            cursor: isDraggingWindow ? 'grabbing' : 'default'
          }}
        >
          {/* Header - Draggable */}
          <div 
            className="chatbot-header" 
            onMouseDown={handleWindowMouseDown}
            onTouchStart={handleWindowMouseDown}
            style={{ cursor: isDraggingWindow ? 'grabbing' : 'grab' }}
          >
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* AI Brain/Neural Network */}
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                  <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                  
                  {/* Central Core */}
                  <circle cx="16" cy="16" r="3" fill="currentColor"/>
                  
                  {/* Neural Connections */}
                  <circle cx="10" cy="10" r="2" fill="currentColor"/>
                  <circle cx="22" cy="10" r="2" fill="currentColor"/>
                  <circle cx="10" cy="22" r="2" fill="currentColor"/>
                  <circle cx="22" cy="22" r="2" fill="currentColor"/>
                  
                  <line x1="16" y1="16" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="16" y1="16" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="16" y1="16" x2="10" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                  
                  {/* Sparkles */}
                  <path d="M28 8L29 10L28 12L26 11L28 8Z" fill="currentColor" opacity="0.8"/>
                  <path d="M4 6L5 7.5L4 9L2.5 8L4 6Z" fill="currentColor" opacity="0.7"/>
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
                  onClick={() => handleQuickAction(action)}
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
        ref={buttonRef}
        className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (!hasButtonMoved) {
            toggleChat();
          }
        }}
        onMouseDown={handleButtonMouseDown}
        onTouchStart={handleButtonMouseDown}
        aria-label="Toggle chat"
        style={{
          bottom: `${buttonPosition.bottom}px`,
          right: `${buttonPosition.right}px`,
          cursor: isDraggingButton ? 'grabbing' : 'grab'
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        ) : (
          <img src="/AI_Avatar.webp" alt="AI Assistant" className="chatbot-avatar-icon" />
        )}
        {!isOpen && <span className="chatbot-notification-badge">1</span>}
      </button>
    </div>
  );
};

export default Chatbot;
