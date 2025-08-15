import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// UrbanBuddy AI Assistant Component
const UrbanBuddy = ({ darkMode, onChatOpen }) => {
  const [position, setPosition] = useState({ x: 20, y: 50 });
  const [expression, setExpression] = useState('😊');
  const [direction, setDirection] = useState(1);
  const [costume, setCostume] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const botRef = useRef(null);
  const animationRef = useRef(null);
  const lastInteractionTime = useRef(Date.now());

  // Seasonal costumes
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    
    if (month === 12) setCostume('🎄');
    else if (month === 10) setCostume('🎃');
    else if (month === 2) setCostume('💝');
    else if (month === 4) setCostume('🌸');
    else setCostume(null);
  }, []);

  // Make the bot wander with more dynamic movement
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        const now = Date.now();
        const timeSinceLastInteraction = now - lastInteractionTime.current;
        
        // More active movement right after interaction
        const speedMultiplier = timeSinceLastInteraction < 5000 ? 2 : 1;
        
        let newX = prev.x + (3 * direction * speedMultiplier);
        let newY = prev.y + (Math.random() * 6 - 3);
        
        // Bounce off edges
        if (newX > window.innerWidth - 80) {
          setDirection(-1);
          triggerAnimation('spin');
        }
        if (newX < 20) {
          setDirection(1);
          triggerAnimation('spin');
        }
        if (newY < 20) newY = 20;
        if (newY > window.innerHeight - 100) newY = window.innerHeight - 100;
        
        return { x: newX, y: newY };
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [direction]);

  // Change expressions randomly with more variety
  useEffect(() => {
    const expressions = ['😊', '🤔', '😮', '😎', '👋', '🤖', '✨', '🌟'];
    const expressionInterval = setInterval(() => {
      if (!isActive) {
        setExpression(expressions[Math.floor(Math.random() * expressions.length)]);
        // Random animations when idle
        if (Math.random() > 0.8) {
          triggerAnimation(['bounce', 'spin', 'wobble'][Math.floor(Math.random() * 3)]);
        }
      }
    }, 3000);
    return () => clearInterval(expressionInterval);
  }, [isActive]);

  const triggerAnimation = (type) => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    const botElement = botRef.current;
    if (!botElement) return;
    
    botElement.style.animation = 'none';
    void botElement.offsetWidth; // Trigger reflow
    
    switch(type) {
      case 'spin':
        botElement.style.animation = 'spin 1s ease';
        break;
      case 'bounce':
        botElement.style.animation = 'bounce 0.5s ease';
        break;
      case 'wobble':
        botElement.style.animation = 'wobble 0.8s ease';
        break;
      default:
        botElement.style.animation = '';
    }
    
    animationRef.current = setTimeout(() => {
      if (botElement) botElement.style.animation = '';
    }, 1000);
  };

  const handleClick = () => {
    lastInteractionTime.current = Date.now();
    setIsActive(true);
    triggerAnimation('bounce');
    setExpression('💡');
    
    // Trigger chat opening in parent component
    onChatOpen();
    
    // Return to normal after a delay
    setTimeout(() => {
      setIsActive(false);
    }, 3000);
  };

  // Custom animations
  const animations = `
    @keyframes spin {
      0% { transform: rotate(0deg) scaleX(${direction}); }
      100% { transform: rotate(360deg) scaleX(${direction}); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0) scaleX(${direction}); }
      50% { transform: translateY(-20px) scaleX(${direction}); }
    }
    @keyframes wobble {
      0%, 100% { transform: rotate(0deg) scaleX(${direction}); }
      25% { transform: rotate(5deg) scaleX(${direction}); }
      75% { transform: rotate(-5deg) scaleX(${direction}); }
    }
    @keyframes float {
      0% { transform: translateY(0px) scaleX(${direction}); }
      50% { transform: translateY(-10px) scaleX(${direction}); }
      100% { transform: translateY(0px) scaleX(${direction}); }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <div 
        ref={botRef}
        onClick={handleClick}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          fontSize: '2.5rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: `scaleX(${direction})`,
          zIndex: 100,
          filter: darkMode 
            ? 'drop-shadow(0 0 8px rgba(255,255,255,0.7))' 
            : 'drop-shadow(0 0 8px rgba(0,0,0,0.3))',
          userSelect: 'none',
          animation: 'float 4s ease-in-out infinite'
        }}
      >
        <div style={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Bot icon with costume */}
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            backgroundColor: darkMode ? '#4a5568' : '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
          }}>
            <span style={{ fontSize: '1.8rem' }}>{expression}</span>
            {costume && (
              <span style={{
                position: 'absolute',
                top: '-15px',
                right: '-10px',
                fontSize: '1.5rem',
                transform: 'rotate(15deg)'
              }}>
                {costume}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Chat Modal Component with Functional API Connection
const ChatModal = ({ darkMode, onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm UrbanBuddy, your AI assistant for urban living. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom and focus input
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages]);

  // Function to call the AI API
  const generateResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // In a real app, you should call your own backend endpoint that then calls OpenAI
      // This is just for demonstration purposes
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Note: In production, never expose your API key in frontend code
          // This should be handled through your own backend
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` 
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are UrbanBuddy, a friendly AI assistant for urban living. " +
                "Provide helpful, concise answers (1-2 sentences) about city life, " +
                "transportation, food delivery, local services, and urban living tips. " +
                "Keep responses practical and urban-focused."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 
        "I'm having trouble thinking of a response right now. Could you try asking something else?";
      
      setMessages(prev => [...prev, { 
        text: aiResponse, 
        sender: 'bot' 
      }]);
    } catch (error) {
      console.error("API error:", error);
      // Fallback to a local AI response if API fails
      const fallbackResponses = [
        "I'm currently experiencing high demand. Try again in a moment!",
        "Let me think differently about that... Can you rephrase your question?",
        "I specialize in urban living tips. Ask me about transportation, food, or city services!",
        "I'm having connection issues, but I'd love to help with your urban living questions!"
      ];
      setMessages(prev => [...prev, { 
        text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)], 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      // Add user message
      const userMessage = inputValue.trim();
      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setInputValue('');
      
      // Generate AI response
      await generateResponse(userMessage);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '350px',
      maxWidth: '90%',
      backgroundColor: darkMode ? '#2d3748' : 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
      zIndex: 1000,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '60vh'
    }}>
      {/* Chat header */}
      <div style={{
        padding: '1rem',
        backgroundColor: darkMode ? '#4a5568' : '#3b82f6',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <h3 style={{ margin: 0 }}>UrbanBuddy AI</h3>
          {isTyping && (
            <span style={{ 
              fontSize: '0.8rem',
              marginLeft: '0.5rem',
              opacity: 0.8
            }}>typing...</span>
          )}
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
      
      {/* Chat messages */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '0.6rem 1rem',
              borderRadius: msg.sender === 'user' 
                ? '18px 18px 0 18px' 
                : '18px 18px 18px 0',
              backgroundColor: msg.sender === 'user'
                ? (darkMode ? '#4a5568' : '#3b82f6')
                : (darkMode ? '#4a5568' : '#e2e8f0'),
              color: msg.sender === 'user' ? 'white' : (darkMode ? 'white' : '#1e293b'),
              animation: msg.sender === 'bot' && index === messages.length - 1 
                ? 'fadeIn 0.3s ease' 
                : 'none'
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '0.8rem',
        borderTop: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.value)}
          placeholder="Ask me about urban living..."
          disabled={isTyping}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '20px',
            border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
            backgroundColor: darkMode ? '#2d3748' : 'white',
            color: darkMode ? 'white' : '#1e293b',
            outline: 'none',
            opacity: isTyping ? 0.7 : 1
          }}
        />
        <button 
          type="submit"
          disabled={isTyping}
          style={{
            background: isTyping 
              ? (darkMode ? '#4a5568' : '#e2e8f0')
              : (darkMode ? '#4a5568' : '#3b82f6'),
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isTyping ? 'not-allowed' : 'pointer'
          }}
        >
          {isTyping ? '...' : '➤'}
        </button>
      </form>
    </div>
  );
};

// Weather Widget Component
const WeatherWidget = ({ darkMode }) => {
  const [weather, setWeather] = useState({
    temp: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 12,
    feelsLike: 24,
    icon: '⛅',
    location: 'Nairobi, Kenya',
    time: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  });

  // Mock weather data that changes every time
  const weatherConditions = [
    { temp: 18, condition: 'Partly Cloudy', humidity: 72, wind: 8, feelsLike: 20, icon: '⛅' },
    { temp: 25, condition: 'Sunny', humidity: 45, wind: 15, feelsLike: 27, icon: '☀️' },
    { temp: 16, condition: 'Rainy', humidity: 88, wind: 20, feelsLike: 14, icon: '🌧️' },
    { temp: 22, condition: 'Cloudy', humidity: 68, wind: 12, feelsLike: 24, icon: '☁️' },
    { temp: 28, condition: 'Clear Night', humidity: 55, wind: 6, feelsLike: 30, icon: '🌙' },
    { temp: 19, condition: 'Misty', humidity: 85, wind: 5, feelsLike: 21, icon: '🌫️' },
    { temp: 31, condition: 'Hot & Sunny', humidity: 38, wind: 18, feelsLike: 35, icon: '🔥' },
    { temp: 14, condition: 'Stormy', humidity: 92, wind: 25, feelsLike: 12, icon: '⛈️' }
  ];

  // Update weather randomly every 30 seconds
  useEffect(() => {
    const updateWeather = () => {
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setWeather(prev => ({
        ...prev,
        ...randomWeather,
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      }));
    };

    const interval = setInterval(updateWeather, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '1.5rem',
      margin: '1rem 0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: darkMode ? '1px solid #475569' : '1px solid #cbd5e1',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Weather background pattern */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: darkMode 
          ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        animation: 'rotate 20s linear infinite'
      }}></div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header with location and time */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ 
            margin: 0,
            color: darkMode ? '#e2e8f0' : '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            <span>🌤️</span> Weather
          </h3>
          <span style={{
            fontSize: '0.8rem',
            color: darkMode ? '#94a3b8' : '#64748b',
            backgroundColor: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px'
          }}>
            {weather.time}
          </span>
        </div>

        {/* Location */}
        <p style={{
          margin: '0 0 1rem 0',
          fontSize: '0.9rem',
          color: darkMode ? '#94a3b8' : '#64748b',
          fontWeight: '500'
        }}>
          📍 {weather.location}
        </p>

        {/* Main weather display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '4rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {weather.icon}
          </div>
          <div>
            <p style={{ 
              margin: 0, 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: darkMode ? '#e2e8f0' : '#1e293b',
              lineHeight: 1
            }}>
              {weather.temp}°C
            </p>
            <p style={{ 
              margin: '0.25rem 0 0', 
              color: darkMode ? '#94a3b8' : '#64748b',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {weather.condition}
            </p>
          </div>
        </div>

        {/* Weather details grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: darkMode ? '1px solid #475569' : '1px solid #cbd5e1'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
            borderRadius: '12px',
            transition: 'transform 0.2s ease'
          }}>
            <p style={{ 
              margin: '0 0 0.5rem', 
              fontSize: '0.75rem',
              color: darkMode ? '#94a3b8' : '#64748b',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Humidity</p>
            <p style={{ 
              margin: 0, 
              fontWeight: '700',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontSize: '1.1rem'
            }}>{weather.humidity}%</p>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
            borderRadius: '12px',
            transition: 'transform 0.2s ease'
          }}>
            <p style={{ 
              margin: '0 0 0.5rem', 
              fontSize: '0.75rem',
              color: darkMode ? '#94a3b8' : '#64748b',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Wind</p>
            <p style={{ 
              margin: 0, 
              fontWeight: '700',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontSize: '1.1rem'
            }}>{weather.wind} km/h</p>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
            borderRadius: '12px',
            transition: 'transform 0.2s ease'
          }}>
            <p style={{ 
              margin: '0 0 0.5rem', 
              fontSize: '0.75rem',
              color: darkMode ? '#94a3b8' : '#64748b',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Feels Like</p>
            <p style={{ 
              margin: 0, 
              fontWeight: '700',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontSize: '1.1rem'
            }}>{weather.feelsLike}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Emergency Services Component
const EmergencyServices = ({ darkMode }) => {
  const services = [
    { 
      name: "Police", 
      number: "999", 
      icon: "👮", 
      color: "#3b82f6",
      description: "Emergency police response",
      responseTime: "5-10 min"
    },
    { 
      name: "Ambulance", 
      number: "911", 
      icon: "🚑", 
      color: "#ef4444",
      description: "Medical emergency response",
      responseTime: "3-7 min"
    },
    { 
      name: "Fire Brigade", 
      number: "999", 
      icon: "🚒", 
      color: "#f59e0b",
      description: "Fire and rescue services",
      responseTime: "5-12 min"
    },
    { 
      name: "Child Helpline", 
      number: "116", 
      icon: "🧒", 
      color: "#10b981",
      description: "24/7 child protection",
      responseTime: "Immediate"
    },
    { 
      name: "Traffic Police", 
      number: "112", 
      icon: "🚦", 
      color: "#8b5cf6",
      description: "Traffic incidents",
      responseTime: "8-15 min"
    },
    { 
      name: "Coast Guard", 
      number: "113", 
      icon: "⚓", 
      color: "#06b6d4",
      description: "Maritime emergencies",
      responseTime: "10-20 min"
    }
  ];

  return (
    <div style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' 
        : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      borderRadius: '16px',
      padding: '1.5rem',
      margin: '1rem 0',
      boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15)',
      border: darkMode ? '1px solid #dc2626' : '1px solid #fecaca',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Emergency background pattern */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: darkMode 
          ? 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%)',
        animation: 'pulse 2s ease-in-out infinite'
      }}></div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            🚨
          </div>
          <div>
            <h3 style={{ 
              margin: 0,
              color: darkMode ? '#fecaca' : '#991b1b',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              Emergency Contacts
            </h3>
            <p style={{
              margin: '0.25rem 0 0',
              fontSize: '0.8rem',
              color: darkMode ? '#fca5a5' : '#dc2626',
              fontWeight: '500'
            }}>
              Tap to call emergency services
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem'
        }}>
          {services.map((service) => (
            <a 
              key={service.name}
              href={`tel:${service.number}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '12px',
                background: darkMode 
                  ? 'rgba(220, 38, 38, 0.2)' 
                  : 'rgba(255, 255, 255, 0.8)',
                color: darkMode ? '#fecaca' : '#991b1b',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: darkMode 
                  ? '1px solid rgba(220, 38, 38, 0.3)' 
                  : '1px solid rgba(220, 38, 38, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {/* Service icon with glow effect */}
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                filter: `drop-shadow(0 0 8px ${service.color})`,
                animation: 'float 2s ease-in-out infinite'
              }}>
                {service.icon}
              </div>
              
              {/* Service name */}
              <span style={{ 
                fontWeight: '700',
                marginBottom: '0.25rem',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {service.name}
              </span>
              
              {/* Phone number */}
              <span style={{ 
                fontSize: '1.1rem',
                fontWeight: '800',
                color: service.color,
                marginBottom: '0.5rem'
              }}>
                {service.number}
              </span>
              
              {/* Description */}
              <span style={{
                fontSize: '0.7rem',
                textAlign: 'center',
                color: darkMode ? '#fca5a5' : '#dc2626',
                fontWeight: '500',
                lineHeight: 1.2
              }}>
                {service.description}
              </span>
              
              {/* Response time */}
              <span style={{
                fontSize: '0.65rem',
                color: darkMode ? '#fca5a5' : '#dc2626',
                fontWeight: '600',
                marginTop: '0.25rem',
                backgroundColor: darkMode 
                  ? 'rgba(220, 38, 38, 0.2)' 
                  : 'rgba(220, 38, 38, 0.1)',
                padding: '0.2rem 0.4rem',
                borderRadius: '8px'
              }}>
                {service.responseTime}
              </span>
            </a>
          ))}
        </div>

        {/* Emergency notice */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: darkMode 
            ? 'rgba(220, 38, 38, 0.2)' 
            : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          border: darkMode 
            ? '1px solid rgba(220, 38, 38, 0.3)' 
            : '1px solid rgba(220, 38, 38, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: darkMode ? '#fca5a5' : '#991b1b',
            fontWeight: '600'
          }}>
            ⚠️ For life-threatening emergencies, call 999 immediately
          </p>
        </div>
      </div>
    </div>
  );
};

// Events Widget Component
const EventsWidget = ({ darkMode }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Nairobi Jazz Festival",
      date: "2024-12-15",
      time: "7:00 PM",
      venue: "KICC Convention Centre",
      description: "Annual jazz festival featuring local and international artists. A celebration of African jazz heritage with performances from Grammy-winning musicians.",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Music",
      price: "KSh 2,500",
      organizer: "Nairobi Arts Council",
      capacity: "2,000 people"
    },
    {
      id: 2,
      name: "Kenya National Theatre Play",
      date: "2024-12-20",
      time: "6:30 PM",
      venue: "Kenya National Theatre",
      description: "Award-winning theatrical performance showcasing Kenya's rich cultural stories. Directed by acclaimed director John Sibi-Okumu.",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Theatre",
      price: "KSh 1,800",
      organizer: "Kenya National Theatre",
      capacity: "500 people"
    },
    {
      id: 3,
      name: "Nairobi Food Festival",
      date: "2024-12-25",
      time: "12:00 PM",
      venue: "Carnivore Grounds",
      description: "Experience the diverse culinary delights from across Kenya and beyond. Food tasting, cooking demonstrations, and live entertainment.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Food & Culture",
      price: "KSh 3,000",
      organizer: "Kenya Tourism Board",
      capacity: "5,000 people"
    },
    {
      id: 4,
      name: "Tech Innovation Summit",
      date: "2024-12-28",
      time: "9:00 AM",
      venue: "Nairobi Innovation Hub",
      description: "Join tech leaders, entrepreneurs, and innovators for a day of networking, workshops, and cutting-edge technology demonstrations.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Technology",
      price: "KSh 5,000",
      organizer: "Nairobi Tech Community",
      capacity: "1,000 people"
    },
    {
      id: 5,
      name: "Art Exhibition: Modern Africa",
      date: "2024-12-30",
      time: "10:00 AM",
      venue: "Nairobi Gallery",
      description: "Contemporary African art exhibition featuring works from emerging and established artists across the continent.",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Art",
      price: "Free Entry",
      organizer: "Nairobi Arts Foundation",
      capacity: "300 people"
    },
    {
      id: 6,
      name: "Sports & Fitness Expo",
      date: "2025-01-05",
      time: "8:00 AM",
      venue: "Nyayo National Stadium",
      description: "Annual sports and fitness expo featuring equipment demonstrations, fitness challenges, and wellness workshops.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Sports",
      price: "KSh 1,500",
      organizer: "Kenya Sports Federation",
      capacity: "10,000 people"
    }
  ]);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Rotate through events every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex(prev => (prev + 1) % events.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [events.length]);

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div style={{
        backgroundColor: darkMode ? '#2d3748' : '#f3f4f6',
        borderRadius: '12px',
        padding: '1.5rem',
        margin: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '1.5rem',
          color: darkMode ? '#e2e8f0' : '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🎭</span> Upcoming Events
        </h3>
        
        {/* Featured Event Carousel */}
        <div style={{ 
          position: 'relative',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedEvent(events[currentEventIndex])}
          >
            {/* Event Image */}
            <img 
              src={events[currentEventIndex].image} 
              alt={events[currentEventIndex].name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            
            {/* Event Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: '1.5rem',
              color: 'white'
            }}>
              {/* Category Badge */}
              <span style={{
                display: 'inline-block',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {events[currentEventIndex].category}
              </span>
              
              {/* Event Title */}
              <h4 style={{ 
                margin: '0 0 0.5rem', 
                fontSize: '1.2rem',
                fontWeight: '700',
                lineHeight: 1.2
              }}>
                {events[currentEventIndex].name}
              </h4>
              
              {/* Event Details */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.85rem',
                opacity: 0.9
              }}>
                <span>📅 {formatDate(events[currentEventIndex].date)}</span>
                <span>🕐 {events[currentEventIndex].time}</span>
                <span>📍 {events[currentEventIndex].venue}</span>
              </div>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEventIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentEventIndex 
                    ? (darkMode ? '#3b82f6' : '#1e40af')
                    : (darkMode ? '#4a5568' : '#cbd5e1'),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Event List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.slice(0, 3).map((event, index) => (
            <div 
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '12px',
                backgroundColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: darkMode ? '1px solid rgba(71, 85, 105, 0.2)' : '1px solid rgba(203, 213, 225, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.backgroundColor = darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.backgroundColor = darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)';
              }}
            >
              <img 
                src={event.image} 
                alt={event.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h5 style={{ 
                  margin: '0 0 0.25rem', 
                  color: darkMode ? '#e2e8f0' : '#1e293b',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  lineHeight: 1.2
                }}>
                  {event.name}
                </h5>
                <p style={{ 
                  margin: '0 0 0.25rem', 
                  fontSize: '0.75rem',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  fontWeight: '500'
                }}>
                  📍 {event.venue}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: darkMode ? '#94a3b8' : '#64748b'
                  }}>
                    📅 {formatDate(event.date)}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: event.price === 'Free Entry' ? '#10b981' : '#3b82f6',
                    backgroundColor: event.price === 'Free Entry' 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'rgba(59, 130, 246, 0.1)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '6px'
                  }}>
                    {event.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setSelectedEvent(events[Math.floor(Math.random() * events.length)])}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'transparent',
            border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
            borderRadius: '12px',
            color: darkMode ? '#e2e8f0' : '#1e293b',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🎭 View All Events ({events.length})
        </button>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setSelectedEvent(null)}>
          <div style={{
            backgroundColor: darkMode ? '#2d3748' : 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ 
                  margin: 0,
                  color: darkMode ? '#e2e8f0' : '#1e293b'
                }}>
                  {selectedEvent.name}
                </h3>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: darkMode ? '#a0aec0' : '#64748b',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span>📅</span>
                <span style={{ color: darkMode ? '#a0aec0' : '#64748b' }}>
                  {selectedEvent.date}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <span>📍</span>
                <span style={{ color: darkMode ? '#a0aec0' : '#64748b' }}>
                  {selectedEvent.venue}
                </span>
              </div>
              
              <p style={{ 
                color: darkMode ? '#e2e8f0' : '#1e293b',
                lineHeight: '1.6'
              }}>
                {selectedEvent.description}
              </p>
              
              <button 
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  backgroundColor: darkMode ? '#4a5568' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  ':hover': {
                    opacity: 0.9
                  }
                }}
              >
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Home Component
export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const services = [
    { 
      name: 'Transport', 
      path: '/transport', 
      icon: '🚌', 
      desc: 'Plan your multi-modal journey across the city',
      color: '#3b82f6',
      details: 'Find the best routes combining metro, buses, and bikes. Real-time updates and ticket purchasing available.',
      features: ['Route Planning', 'Real-time Updates', 'Multi-modal Options', 'Ticket Booking']
    },
    { 
      name: 'Food & Markets', 
      path: '/food', 
      icon: '🍔', 
      desc: 'Discover local restaurants and fresh markets',
      color: '#ef4444',
      details: 'Order from hundreds of restaurants with special discounts. Explore local markets for fresh produce and crafts.',
      features: ['Restaurant Delivery', 'Local Markets', 'Fresh Produce', 'Cultural Crafts']
    },
    { 
      name: 'AI Assistant', 
      path: '/assistant', 
      icon: '🤖', 
      desc: 'Get personalized urban living guidance',
      color: '#8b5cf6',
      details: 'Your AI companion for navigating city life, finding services, and getting personalized recommendations.',
      features: ['24/7 Support', 'Personalized Tips', 'Service Discovery', 'Smart Recommendations']
    },
    { 
      name: 'City Services', 
      path: '/transport', 
      icon: '🏛️', 
      desc: 'Access essential urban services',
      color: '#10b981',
      details: 'Find government services, utilities, and essential city resources all in one place.',
      features: ['Government Services', 'Utilities', 'Emergency Contacts', 'Local Information']
    },
    { 
      name: 'Events & Culture', 
      path: '/food', 
      icon: '🎭', 
      desc: 'Discover concerts, shows and happenings',
      color: '#f59e0b',
      details: 'Find the latest concerts, theater shows, art exhibitions and special events happening around Nairobi.',
      features: ['Event Discovery', 'Ticket Booking', 'Cultural Experiences', 'Local Entertainment']
    }
  ];

  // Check for achievements
  useEffect(() => {
    if (orderCount === 1) {
      addAchievement('First Order!', '🎉');
    } else if (orderCount === 5) {
      addAchievement('Regular Customer!', '🏆');
    } else if (orderCount === 10) {
      addAchievement('Super User!', '🌟');
    }
  }, [orderCount]);

  const addAchievement = (title, icon) => {
    if (!achievements.some(a => a.title === title)) {
      const newAchievement = { title, icon, id: Date.now() };
      setAchievements(prev => [...prev, newAchievement]);
      
      // Auto-hide achievement after 3 seconds
      setTimeout(() => {
        setAchievements(prev => prev.filter(a => a.id !== newAchievement.id));
      }, 3000);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Enhanced search functionality
      const query = searchQuery.toLowerCase();
      if (query.includes('food') || query.includes('restaurant') || query.includes('eat')) {
        navigate('/food');
      } else if (query.includes('transport') || query.includes('bus') || query.includes('taxi')) {
        navigate('/transport');
      } else if (query.includes('assistant') || query.includes('help') || query.includes('ai')) {
        navigate('/assistant');
      } else {
        navigate(`/food?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openServicePopup = (service) => {
    setSelectedService(service);
    setOrderCount(prev => prev + 1);
  };

  const closePopup = () => {
    setSelectedService(null);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#1a202c' : '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '3rem',
      color: darkMode ? '#e2e8f0' : '#1e293b',
      transition: 'all 0.3s ease',
      position: 'relative'
    }}>
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleDarkMode} 
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          background: darkMode ? '#4a5568' : '#e2e8f0',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: 100
        }}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      {/* Hero Section with UrbanBuddy */}
      <section style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        height: '350px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}>UrbanFlow</h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
          }}>Your seamless urban living companion in Nairobi</p>
          
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            maxWidth: '600px',
            margin: '0 auto',
            borderRadius: '50px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          }}>
            <input
              type="text"
              placeholder="Search for restaurants, transport, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                border: 'none',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: darkMode ? '#2d3748' : 'white',
                color: darkMode ? '#e2e8f0' : '#1e293b',
              }}
            />
            <button type="submit" style={{
              backgroundColor: darkMode ? '#4a5568' : '#1e40af',
              color: 'white',
              border: 'none',
              padding: '0 1.5rem',
              cursor: 'pointer',
              fontSize: '1.25rem',
              transition: 'background-color 0.2s'
            }}>
              <span>🔍</span>
            </button>
          </form>
        </div>
        <UrbanBuddy darkMode={darkMode} onChatOpen={toggleChat} />
      </section>

      {/* Services Grid */}
      <section style={{
        padding: '2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: darkMode ? '#e2e8f0' : '#1e293b',
          textAlign: 'center',
        }}>What do you need today?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem',
        }}>
          {services.map((service) => (
            <div 
              key={service.name} 
              onClick={() => openServicePopup(service)}
              style={{ 
                padding: '2rem 1.5rem',
                borderRadius: '16px',
                border: `2px solid ${service.color}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                backgroundColor: darkMode 
                  ? `${service.color}20` 
                  : `${service.color}10`,
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                display: 'inline-block',
                animation: 'float 3s ease-in-out infinite'
              }}>{service.icon}</div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>{service.name}</h3>
              <p style={{color: darkMode ? '#a0aec0' : '#64748b', marginBottom: '1rem'}}>{service.desc}</p>
              
              {/* Service Features */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginTop: '1rem'
              }}>
                {service.features.slice(0, 2).map((feature, index) => (
                  <span key={index} style={{
                    fontSize: '0.8rem',
                    backgroundColor: `${service.color}20`,
                    color: service.color,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Widgets Section */}
      <section style={{
        padding: '2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <WeatherWidget darkMode={darkMode} />
        <EmergencyServices darkMode={darkMode} />
        <EventsWidget darkMode={darkMode} />
      </section>

      {/* Featured Section */}
      <section style={{
        padding: '2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: darkMode ? '#e2e8f0' : '#1e293b',
          textAlign: 'center',
        }}>Quick Access</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <button 
            onClick={() => navigate('/transport?from=home&to=downtown')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: darkMode ? '#2d3748' : '#e2e8f0',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            🚕 To Downtown
          </button>
          <button 
            onClick={() => navigate('/food?category=fastfood')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: darkMode ? '#2d3748' : '#e2e8f0',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            🍟 Fast Food
          </button>
          <button 
            onClick={() => navigate('/food?category=coffee')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: darkMode ? '#2d3748' : '#e2e8f0',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            ☕ Coffee Shops
          </button>
          <button 
            onClick={() => navigate('/assistant')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: darkMode ? '#2d3748' : '#e2e8f0',
              color: darkMode ? '#e2e8f0' : '#1e293b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            🤖 AI Assistant
          </button>
        </div>
      </section>

      {/* Service Popup */}
      {selectedService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }} onClick={closePopup}>
          <div style={{
            backgroundColor: darkMode ? '#2d3748' : 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
          }} onClick={(e) => e.stopPropagation()}>
            <button style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#a0aec0' : '#64748b',
            }} onClick={closePopup}>×</button>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '2.5rem', animation: 'float 3s ease-in-out infinite' }}>{selectedService.icon}</span>
              <h3 style={{fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: darkMode ? '#e2e8f0' : '#1e293b'}}>{selectedService.name}</h3>
            </div>
            <p style={{color: darkMode ? '#a0aec0' : '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>{selectedService.details}</p>
            
            {/* Features List */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: darkMode ? '#e2e8f0' : '#1e293b', marginBottom: '0.5rem' }}>Key Features:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedService.features.map((feature, index) => (
                  <span key={index} style={{
                    fontSize: '0.9rem',
                    backgroundColor: `${selectedService.color}20`,
                    color: selectedService.color,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <button 
              style={{ 
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedService.color,
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '1rem',
                width: '100%'
              }}
              onClick={() => {
                navigate(selectedService.path);
                closePopup();
              }}
            >
              Explore {selectedService.name}
            </button>
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.map(achievement => (
        <div key={achievement.id} style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: darkMode ? '#2d3748' : 'white',
          color: darkMode ? 'white' : '#1e293b',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000,
          animation: 'slideIn 0.5s forwards, fadeOut 0.5s forwards 2.5s'
        }}>
          <span style={{fontSize: '1.5rem'}}>{achievement.icon}</span>
          <span>{achievement.title}</span>
        </div>
      ))}

      {/* Chat Modal */}
      {showChat && <ChatModal darkMode={darkMode} onClose={toggleChat} />}

      {/* Footer with copyright */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        color: darkMode ? '#a0aec0' : '#64748b',
        fontSize: '0.9rem',
        marginTop: '2rem'
      }}>
        <p>© {new Date().getFullYear()} UrbanFlow - Your Nairobi Urban Living Companion</p>
      </footer>
    </div>
  );
};

// Add CSS animations to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}