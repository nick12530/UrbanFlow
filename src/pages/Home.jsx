import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    { 
      name: 'Transport', 
      path: '/transport', 
      icon: '🚌', 
      desc: 'Plan your multi-modal journey across the city',
      color: '#3b82f6'
    },
    { 
      name: 'Food Delivery', 
      path: '/food', 
      icon: '🍔', 
      desc: 'Discover local restaurants and cafes',
      color: '#ef4444'
    },
    { 
      name: 'Groceries', 
      path: '/food', 
      icon: '🛒', 
      desc: 'Get groceries delivered in minutes',
      color: '#10b981'
    },
    { 
      name: 'Services', 
      path: '/food', 
      icon: '🛠️', 
      desc: 'Find urban services near you',
      color: '#8b5cf6'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/food?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>UrbanFlow</h1>
          <p className="tagline">Your seamless urban living companion</p>
          
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search for restaurants, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <span>🔍</span>
            </button>
          </form>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <h2>What do you need today?</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.name} 
              className="service-card"
              style={{ '--card-color': service.color }}
              onClick={() => navigate(service.path)}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <h2>Quick Access</h2>
        <div className="quick-links">
          <button onClick={() => navigate('/transport?from=home&to=downtown')}>
            🚕 To Downtown
          </button>
          <button onClick={() => navigate('/food?category=fastfood')}>
            🍟 Fast Food
          </button>
          <button onClick={() => navigate('/food?category=coffee')}>
            ☕ Coffee Shops
          </button>
        </div>
      </section>
    </div>
  );
}