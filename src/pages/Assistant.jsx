import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiUser, FiMessageSquare } from 'react-icons/fi';

export default function Assistant() {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      content: "Hello! I'm your UrbanFlow Assistant. I can help you with:\n\n🚌 Transport planning and routes\n🍔 Food recommendations and delivery\n🏥 Healthcare services\n🎓 Educational institutions\n🎭 Entertainment and events\n\nWhat would you like to know about?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setError('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiBase = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${apiBase}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessage, 
          history: messages.slice(0, -1),
          systemInstruction: `You are UrbanFlow Assistant, a helpful AI for urban living in Nairobi, Kenya. 
          
          You help users with:
          - Transport planning (buses, taxis, trains, bike hire)
          - Food delivery and restaurant recommendations
          - Healthcare services and clinics
          - Educational institutions
          - Entertainment and events
          
          Keep responses concise, practical, and focused on Nairobi. Use Ksh for prices, mention specific areas like Westlands, CBD, Karen, etc.
          
          If asked about features you don't know, suggest they check the relevant section of the app.`
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }
      
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (e) {
      console.error('Assistant error:', e);
      const errorMessage = e.message === 'Failed to fetch' 
        ? 'Unable to connect to the assistant. Please check your internet connection and try again.'
        : e.message || 'Something went wrong. Please try again.';
      
      setError(errorMessage);
      setMessages([...newMessages, { 
        role: 'model', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or check your internet connection." 
      }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const styles = {
    container: {
      maxWidth: 800,
      margin: '40px auto',
      padding: 16,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: 24,
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 12,
      color: 'white',
    },
    title: {
      margin: 0,
      fontSize: '28px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    subtitle: {
      margin: '8px 0 0 0',
      opacity: 0.9,
      fontSize: '16px',
    },
    chatContainer: {
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      background: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
    },
    messagesArea: {
      flex: 1,
      padding: 16,
      overflowY: 'auto',
      background: '#f8fafc',
    },
    message: {
      marginBottom: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    },
    userMessage: {
      flexDirection: 'row-reverse',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 600,
      flexShrink: 0,
    },
    userAvatar: {
      background: '#3b82f6',
      color: 'white',
    },
    botAvatar: {
      background: '#10b981',
      color: 'white',
    },
    messageContent: {
      maxWidth: '70%',
      padding: 12,
      borderRadius: 12,
      fontSize: 14,
      lineHeight: 1.5,
    },
    userContent: {
      background: '#3b82f6',
      color: 'white',
      borderBottomRightRadius: 4,
    },
    botContent: {
      background: 'white',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      borderBottomLeftRadius: 4,
    },
    inputArea: {
      padding: 16,
      borderTop: '1px solid #e2e8f0',
      background: 'white',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-end',
    },
    textarea: {
      flex: 1,
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 8,
      fontSize: 14,
      resize: 'none',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    textareaFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    sendButton: {
      padding: '12px 16px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transition: 'background-color 0.2s',
    },
    sendButtonHover: {
      background: '#2563eb',
    },
    sendButtonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed',
    },
    error: {
      color: '#dc2626',
      fontSize: 14,
      textAlign: 'center',
      padding: 8,
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 8,
      marginBottom: 16,
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: '#6b7280',
      fontSize: 14,
    },
    typingIndicator: {
      display: 'flex',
      gap: 4,
      padding: '8px 0',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#9ca3af',
      animation: 'typing 1.4s infinite ease-in-out',
    },
    dot1: { animationDelay: '-0.32s' },
    dot2: { animationDelay: '-0.16s' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FiMessageCircle size={28} />
          UrbanFlow Assistant
        </h1>
        <p style={styles.subtitle}>Your AI companion for urban living in Nairobi</p>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.message,
                ...(m.role === 'user' ? styles.userMessage : {})
              }}
            >
              <div style={{
                ...styles.avatar,
                ...(m.role === 'user' ? styles.userAvatar : styles.botAvatar)
              }}>
                {m.role === 'user' ? <FiUser size={16} /> : <FiMessageSquare size={16} />}
              </div>
              <div style={{
                ...styles.messageContent,
                ...(m.role === 'user' ? styles.userContent : styles.botContent)
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={styles.message}>
              <div style={{...styles.avatar, ...styles.botAvatar}}>
                <FiMessageSquare size={16} />
              </div>
              <div style={{...styles.messageContent, ...styles.botContent}}>
                <div style={styles.loading}>
                  <span>Assistant is typing</span>
                  <div style={styles.typingIndicator}>
                    <div style={{...styles.dot, ...styles.dot1}}></div>
                    <div style={{...styles.dot, ...styles.dot2}}></div>
                    <div style={styles.dot}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && <div style={styles.error}>{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about transport, food, healthcare, education, or entertainment in Nairobi..."
            rows={1}
            style={{
              ...styles.textarea,
              ...(input ? styles.textareaFocus : {})
            }}
            disabled={loading}
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()}
            style={{
              ...styles.sendButton,
              ...(loading || !input.trim() ? styles.sendButtonDisabled : {})
            }}
          >
            <FiSend size={16} />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


