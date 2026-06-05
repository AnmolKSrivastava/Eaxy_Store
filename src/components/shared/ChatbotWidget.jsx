import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronLeft, Package, MapPin, Wrench, Shield, Phone } from 'lucide-react';
import { getOrder } from '../../firebase/orderService';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentFlow, setCurrentFlow] = useState('main');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const coverageAreas = [
    'Pimpri-Chinchwad',
    'Kothrud & Warje',
    'Hadapsar & Magarpatta',
    'Shivajinagar & Camp',
    'Aundh & Baner',
    'Wakad & Hinjewadi',
    'Kharadi & Viman Nagar',
    'Deccan & FC Road',
    'Koregaon Park',
    'Katraj & Kondhwa',
    'Pashan & Sus',
    'Ravet & Moshi'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Welcome to Eaxy Store! I'm here to help you with:\n\n• Track your order\n• Check delivery coverage\n• 4-hour delivery info\n• Repair services\n• Warranty & returns\n• Contact support\n\nHow can I assist you today?",
        'main'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addBotMessage = (text, flow = currentFlow, options = null) => {
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      text,
      flow,
      options,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const handleQuickAction = (action) => {
    addUserMessage(action.label);
    
    switch (action.id) {
      case 'track_order':
        setCurrentFlow('track_order');
        addBotMessage(
          "📦 To track your order, please enter your Order ID.\n\nYou can find it in your confirmation email or orders page.",
          'track_order'
        );
        break;

      case 'check_coverage':
        setCurrentFlow('coverage');
        addBotMessage(
          `🗺️ We deliver to the following areas in Pune:\n\n${coverageAreas.map((area, idx) => `${idx + 1}. ${area}`).join('\n')}\n\n✅ We guarantee 4-hour delivery to all these zones!\n\nIs your area listed above?`,
          'coverage',
          [
            { id: 'coverage_yes', label: '✓ Yes, my area is covered' },
            { id: 'coverage_no', label: '✗ No, I don\'t see my area' }
          ]
        );
        break;

      case 'delivery_info':
        setCurrentFlow('delivery_faq');
        addBotMessage(
          "⚡ 4-Hour Delivery Promise:\n\n• Order confirmed within 15 minutes\n• Prepared & dispatched in 30 minutes\n• Delivered within 4 hours guaranteed\n• Available 7 days a week\n• Real-time tracking\n• Free delivery on orders above ₹5,000\n\nDelivery charges: ₹99 (below ₹5,000)",
          'delivery_faq',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'repair_services':
        setCurrentFlow('repair');
        addBotMessage(
          "🔧 Our Repair Services:\n\n• Laptop Repair (Screen, Battery, etc.)\n• Smartphone Repair\n• Computer Hardware Issues\n• Data Recovery\n• Software Installation\n\n⏱️ Most repairs completed same day!\n\nWould you like to book a repair or check repair status?",
          'repair',
          [
            { id: 'book_repair', label: '📅 Book Repair Service' },
            { id: 'repair_status', label: '🔍 Check Repair Status' },
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'warranty_info':
        setCurrentFlow('warranty');
        addBotMessage(
          "🛡️ Warranty & Returns:\n\n📱 New Products:\n• Manufacturer warranty (6-12 months)\n• 7-day replacement for defects\n• Easy return process\n\n💻 Refurbished Products:\n• 6-month Eaxy Store warranty\n• 7-day testing period\n• Free repairs during warranty\n\n📦 Return Policy:\n• 7 days from delivery\n• Product must be unused\n• Original packaging required\n• Full refund processed in 5-7 days",
          'warranty',
          [
            { id: 'initiate_return', label: '↩️ Initiate Return' },
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'contact_support':
        setCurrentFlow('contact');
        addBotMessage(
          "📞 Contact Our Support Team:\n\n• 📱 WhatsApp: +91 98765 43210\n• ☎️ Call: 020-1234-5678\n• ✉️ Email: support@eaxystore.com\n• ⏰ Hours: 9 AM - 9 PM (7 days)\n\nFor urgent issues, WhatsApp is the fastest!",
          'contact',
          [
            { id: 'whatsapp', label: '💬 Open WhatsApp' },
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'coverage_yes':
        addBotMessage(
          "🎉 Great! You're in our delivery zone.\n\n• Order now and get it in 4 hours\n• Free delivery on orders ₹5,000+\n• Real-time tracking available\n\nReady to shop?",
          'main',
          [
            { id: 'browse_products', label: '🛍️ Browse Products' },
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'coverage_no':
        addBotMessage(
          "We're sorry! We currently serve only Pune district.\n\n🚀 We're expanding soon to:\n• Satara\n• Solapur\n• Ahmednagar\n\nLeave your email at support@eaxystore.com to get notified when we launch in your area!",
          'main',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'book_repair':
        window.open('/repair-services', '_blank');
        addBotMessage(
          "Opening repair booking page...\n\nI've opened the repair services page in a new tab. You can browse our services and book online!",
          'main',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'repair_status':
        setCurrentFlow('repair_status');
        addBotMessage(
          "To check your repair status, please enter your Repair Booking ID (format: REP-XXXXXXXX)",
          'repair_status'
        );
        break;

      case 'browse_products':
        window.open('/products', '_blank');
        addBotMessage(
          "Opening products page...\n\nBrowse our collection and enjoy 4-hour delivery!",
          'main',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'initiate_return':
        window.open('/orders', '_blank');
        addBotMessage(
          "Opening your orders page...\n\nFrom there, you can select your order and initiate a return request.",
          'main',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'whatsapp':
        window.open('https://wa.me/919876543210', '_blank');
        addBotMessage(
          "Opening WhatsApp...\n\nOur support team will respond shortly!",
          'main',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'view_orders':
        window.open('/orders', '_blank');
        addBotMessage(
          "Opening your orders page...\n\nYou can view all your orders and their status there.",
          'main',
          [
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
        break;

      case 'main_menu':
        setCurrentFlow('main');
        addBotMessage(
          "How else can I help you today?",
          'main'
        );
        break;

      default:
        break;
    }
  };

  const handleTrackOrder = async () => {
    if (!orderIdInput.trim()) {
      addBotMessage("⚠️ Please enter a valid Order ID.", 'track_order');
      return;
    }

    addUserMessage(orderIdInput);
    setIsLoading(true);

    try {
      const order = await getOrder(orderIdInput.trim());
      
      if (order) {
        const statusEmoji = {
          pending: '⏳',
          confirmed: '✅',
          processing: '📦',
          shipped: '🚚',
          delivered: '✓',
          cancelled: '❌'
        };

        addBotMessage(
          `${statusEmoji[order.status] || '📦'} Order Found!\n\n` +
          `Order ID: ${order.orderId}\n` +
          `Status: ${order.status.toUpperCase()}\n` +
          `Total: ₹${order.totalAmount}\n` +
          `Ordered: ${new Date(order.orderDate).toLocaleDateString()}\n\n` +
          `${order.status === 'delivered' ? '✓ Your order has been delivered!' : 
            order.status === 'shipped' ? '🚚 Your order is on the way!' :
            '📦 Your order is being processed.'}\n\n` +
          `View full details in your orders page.`,
          'main',
          [
            { id: 'view_orders', label: '📋 View All Orders' },
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
      } else {
        addBotMessage(
          "❌ Order not found.\n\nPlease check your Order ID and try again. The format should be: ORD-XXXXXXXX-XXXXX\n\nYou can find it in:\n• Confirmation email\n• Orders page\n• SMS notification",
          'track_order',
          [
            { id: 'contact_support', label: '📞 Contact Support' },
            { id: 'main_menu', label: '🏠 Back to Main Menu' }
          ]
        );
      }
    } catch (error) {
      addBotMessage(
        "⚠️ Error tracking order. Please try again or contact support.",
        'main',
        [
          { id: 'contact_support', label: '📞 Contact Support' },
          { id: 'main_menu', label: '🏠 Back to Main Menu' }
        ]
      );
    } finally {
      setIsLoading(false);
      setOrderIdInput('');
    }
  };

  const getQuickActions = () => {
    return [
      { id: 'track_order', label: '📦 Track Order', icon: Package },
      { id: 'check_coverage', label: '🗺️ Check Coverage', icon: MapPin },
      { id: 'delivery_info', label: '⚡ 4-Hour Delivery', icon: Package },
      { id: 'repair_services', label: '🔧 Repair Services', icon: Wrench },
      { id: 'warranty_info', label: '🛡️ Warranty & Returns', icon: Shield },
      { id: 'contact_support', label: '📞 Contact Support', icon: Phone }
    ];
  };

  const renderQuickActions = () => {
    if (currentFlow !== 'main') return null;

    return (
      <div className="chatbot-quick-actions">
        {getQuickActions().map(action => (
          <button
            key={action.id}
            className="chatbot-quick-action-btn"
            onClick={() => handleQuickAction(action)}
          >
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  const renderMessage = (message) => {
    return (
      <div key={message.id} className={`chatbot-message ${message.type}`}>
        <div className="chatbot-message-content">
          <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
          {message.options && (
            <div className="chatbot-options">
              {message.options.map(option => (
                <button
                  key={option.id}
                  className="chatbot-option-btn"
                  onClick={() => handleQuickAction(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="chatbot-timestamp">
          {message.timestamp.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    );
  };

  const renderInputArea = () => {
    if (currentFlow === 'track_order') {
      return (
        <div className="chatbot-input-area">
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
            placeholder="Enter Order ID (ORD-...)"
            className="chatbot-input"
            onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
            disabled={isLoading}
          />
          <button
            className="chatbot-send-btn"
            onClick={handleTrackOrder}
            disabled={isLoading || !orderIdInput.trim()}
          >
            {isLoading ? '⏳' : <Send size={20} />}
          </button>
        </div>
      );
    }

    if (currentFlow === 'repair_status') {
      return (
        <div className="chatbot-input-area">
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
            placeholder="Enter Repair ID (REP-...)"
            className="chatbot-input"
            disabled={isLoading}
          />
          <button
            className="chatbot-send-btn"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <MessageCircle size={24} />
          <span className="chatbot-badge">1</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3>Eaxy Support</h3>
                <p className="chatbot-status">
                  <span className="status-indicator"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map(renderMessage)}
            {renderQuickActions()}
            <div ref={messagesEndRef} />
          </div>

          {renderInputArea()}

          {currentFlow !== 'main' && currentFlow !== 'track_order' && currentFlow !== 'repair_status' && (
            <div className="chatbot-footer">
              <button
                className="chatbot-back-btn"
                onClick={() => handleQuickAction({ id: 'main_menu', label: 'Back to Menu' })}
              >
                <ChevronLeft size={16} />
                Main Menu
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
