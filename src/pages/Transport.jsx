import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiSearch, FiStar, FiPhone, FiClock, FiNavigation, 
  FiMap, FiPlus, FiMinus, FiUser, FiCalendar, FiCreditCard 
} from 'react-icons/fi';
import { 
  FaBus, FaTaxi, FaSchool, FaHospital, FaTrain, 
  FaSubway, FaBicycle, FaClinicMedical, FaUniversity 
} from 'react-icons/fa';
import { MdLocalPharmacy, MdRestaurant, MdShoppingCart } from 'react-icons/md';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Nairobi coordinates
const NAIROBI_CENTER = [-1.286389, 36.817223];

// Enhanced Services Data
const services = {
  transport: [
    {
      id: 1,
      name: "Metro Transit Buses",
      type: "bus",
      icon: <FaBus size={20} />,
      routes: [
        { name: "CBD to Westlands", duration: "25 min", stops: 8, price: "Ksh 50" },
        { name: "CBD to Karen", duration: "35 min", stops: 12, price: "Ksh 80" }
      ],
      contact: "0722000001",
      location: [-1.266, 36.807],
      rating: 4.2,
      schedule: "5:30 AM - 10:30 PM",
      features: ["AC buses", "Mobile payment", "Priority seating"],
      operator: "Nairobi Metro Transit"
    },
    {
      id: 2,
      name: "Nairobi Taxi Network",
      type: "taxi",
      icon: <FaTaxi size={20} />,
      vehicleTypes: [
        { name: "Standard", price: "Ksh 300 base + Ksh 50/km" },
        { name: "Executive", price: "Ksh 500 base + Ksh 80/km" },
        { name: "XL", price: "Ksh 700 base + Ksh 100/km" }
      ],
      contact: "0722000002",
      location: [-1.276, 36.817],
      rating: 4.5,
      schedule: "24/7",
      features: ["Child seats", "English-speaking drivers"],
      operator: "Nairobi Taxi Co-op"
    },
    {
      id: 3,
      name: "Commuter Rail",
      type: "train",
      icon: <FaTrain size={20} />,
      routes: [
        { name: "Central to Syokimau", duration: "45 min", stops: 6, price: "Ksh 100" }
      ],
      contact: "0722000003",
      location: [-1.286, 36.827],
      rating: 4.3,
      schedule: "6:00 AM - 9:00 PM",
      features: ["First class option", "Bike racks"],
      operator: "Kenya Railways"
    }
  ],
  bike: [
    {
      id: 101,
      name: "CBD Bike Station",
      type: "bike",
      icon: <FaBicycle size={20} />,
      location: [-1.2833, 36.8172],
      bikesAvailable: 12,
      slotsAvailable: 8,
      price: "Ksh 200/hour",
      contact: "0722111222",
      rating: 4.4,
      features: ["E-bikes available", "24/7 access"],
      paymentMethods: ["M-Pesa", "Credit Card"]
    }
  ],
  education: [
    {
      id: 201,
      name: "Nairobi School",
      type: "school",
      icon: <FaSchool size={20} />,
      location: [-1.286, 36.827],
      rating: 4.8,
      fees: "Ksh 50,000/term",
      contact: "0722333444",
      programs: ["Primary", "Secondary", "A-Levels"],
      facilities: ["Library", "Sports", "Computer Lab"],
      admission: {
        requirements: ["Birth certificate", "Report cards"],
        process: "Interview and assessment"
      }
    },
    {
      id: 202,
      name: "University of Nairobi",
      type: "university",
      icon: <FaUniversity size={20} />,
      location: [-1.276, 36.817],
      rating: 4.9,
      fees: "Ksh 80,000/semester",
      contact: "0733444555",
      programs: ["Undergraduate", "Postgraduate"],
      faculties: ["Medicine", "Engineering", "Business"]
    }
  ],
  health: [
    {
      id: 301,
      name: "Nairobi Hospital",
      type: "hospital",
      icon: <FaHospital size={20} />,
      location: [-1.296, 36.807],
      rating: 4.6,
      contact: "0733555777",
      services: ["Emergency", "Pharmacy", "Consultation"],
      specialists: ["Cardiology", "Pediatrics", "Orthopedics"],
      insurance: ["NHIF", "AAR", "Jubilee"]
    },
    {
      id: 302,
      name: "Avenue Healthcare",
      type: "clinic",
      icon: <FaClinicMedical size={20} />,
      location: [-1.266, 36.797],
      rating: 4.4,
      contact: "0711222333",
      services: ["Outpatient", "Lab Tests", "Vaccination"],
      operatingHours: {
        weekdays: "8:00 AM - 8:00 PM",
        weekends: "9:00 AM - 5:00 PM"
      }
    }
  ],
  entertainment: [
    {
      id: 401,
      name: "The Hub Karen",
      type: "mall",
      icon: <MdShoppingCart size={20} />,
      location: [-1.316, 36.707],
      rating: 4.3,
      contact: "0722444666",
      facilities: ["Cinema", "Restaurants", "Shops"],
      openingHours: "9:00 AM - 10:00 PM",
      parking: "Available (Ksh 200)"
    },
    {
      id: 402,
      name: "Carnivore Restaurant",
      type: "restaurant",
      icon: <MdRestaurant size={20} />,
      location: [-1.326, 36.717],
      rating: 4.5,
      contact: "0722555888",
      cuisine: ["African", "Grill", "Bar"],
      priceRange: "Ksh 2,500 - Ksh 5,000",
      reservations: true
    }
    
  ]
};

// Custom marker icon
const createCustomIcon = (color = '#3B82F6') => {
  return L.divIcon({
    html: `
      <svg width="30" height="30" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
};

// Component Styles
const styles = `
  .urban-flow-container {
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ecf7faff;
  }
  
  .header {
    margin-bottom: 30px;
  }
  
  .app-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 5px;
  }
  
  .app-title span {
    color: #2563eb;
  }
  
  .app-subtitle {
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  .search-container {
    position: relative;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    font-size: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .category-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .category-btn {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    border: none;
    cursor: pointer;
  }
  
  .category-btn.active {
    background-color: #1cdf43ff;
    color: white;
  }
  
  .category-btn.inactive {
    background-color: white;
    color: #374151;
  }
  
  .map-toggle-btn {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: white;
    border-radius: 8px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
  }
  
  .services-container {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .services-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #111827;
  }
  
  .service-card {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .service-card.selected {
    background-color: #eff6ff;
    border-left: 4px solid #f71d1dff;
  }
  
  .service-card.unselected {
    background-color: white;
  }
  
  .service-card:hover {
    background-color: #6ff483ff;
  }
  
  .service-card-content {
    display: flex;
    align-items: flex-start;
  }
  
  .service-icon {
    padding: 8px;
    margin-right: 16px;
    border-radius: 50%;
    background-color: #eff6ff;
    color: #2563eb;
  }
  
  .service-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: #111827;
  }
  
  .service-meta {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .star-icon {
    color: #f59e0b;
    margin-right: 4px;
  }
  
  .divider {
    margin: 0 8px;
  }
  
  .map-container {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    height: 500px;
    margin-top: 20px;
  }
  
  .no-services {
    text-align: center;
    color: #6b7280;
    padding: 40px 0;
  }

  /* Transport Specific Styles */
  .transport-type-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .transport-type-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background: #e5e7eb;
    cursor: pointer;
    font-size: 14px;
  }

  .transport-type-btn.active {
    background: #2563eb;
    color: white;
  }

  .route-planner {
    background: #f3f4f6;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .route-planner h3 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }

  .route-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }

  .route-inputs input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
  }

  .plan-route-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
  }

  .bike-hire-card {
    background: white;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .bike-station-info h4 {
    margin: 0 0 8px 0;
    font-size: 1rem;
  }

  .bike-availability {
    display: flex;
    gap: 12px;
    margin: 8px 0;
    font-size: 14px;
    color: #6b7280;
  }

  .bike-pricing {
    font-weight: 500;
    color: #111827;
  }

  .hire-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  /* Itinerary Styles */
  .itinerary-panel {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .itinerary-panel h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.1rem;
  }

  .itinerary-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .itinerary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .item-details {
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-weight: 500;
    font-size: 14px;
  }

  .item-time {
    font-size: 13px;
    color: #6b7280;
  }

  .remove-btn {
    background: #fef2f2;
    color: #ef4444;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
  }

  .empty-itinerary {
    color: #6b7280;
    text-align: center;
    padding: 16px 0;
    font-size: 14px;
  }

  /* Service Details Styles */
  .service-details {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .service-details h3 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1.2rem;
  }

  .detail-row {
    display: flex;
    margin-bottom: 8px;
  }

  .detail-label {
    font-weight: 500;
    width: 120px;
    color: #4b5563;
  }

  .detail-value {
    flex: 1;
  }

  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .feature-tag {
    background: #e5e7eb;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
  }

  .action-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

// Components
const TransportTypeFilter = ({ activeType, onChange }) => {
  const types = [
    { id: "all", name: "All Transport" },
    { id: "bus", name: "Buses" },
    { id: "taxi", name: "Taxis" },
    { id: "bike", name: "Bike Hire" }
  ];

  return (
    <div className="transport-type-filters">
      {types.map(type => (
        <button
          key={type.id}
          className={`transport-type-btn ${activeType === type.id ? 'active' : ''}`}
          onClick={() => onChange(type.id)}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
};

const RoutePlanner = ({ onPlanRoute }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="route-planner">
      <h3>Plan Your Route</h3>
      <div className="route-inputs">
        <input
          type="text"
          placeholder="Starting point"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <button 
        className="plan-route-btn"
        onClick={() => onPlanRoute({ start, end, time })}
      >
        <FiNavigation size={16} /> Find Best Route
      </button>
    </div>
  );
};

const BikeHireCard = ({ station, onHire }) => {
  return (
    <div className="bike-hire-card">
      <div className="bike-station-info">
        <h4>{station.name}</h4>
        <div className="bike-availability">
          <span>Bikes: {station.bikesAvailable}</span>
          <span>Slots: {station.slotsAvailable}</span>
        </div>
        <div className="bike-pricing">{station.price}</div>
      </div>
      <button 
        className="hire-btn"
        onClick={() => onHire(station)}
      >
        <FiCreditCard size={14} /> Hire Bike
      </button>
    </div>
  );
};

const ItineraryPanel = ({ items, onRemove }) => {
  return (
    <div className="itinerary-panel">
      <h3>Your Itinerary</h3>
      {items.length === 0 ? (
        <p className="empty-itinerary">No items in your itinerary yet</p>
      ) : (
        <ul className="itinerary-list">
          {items.map((item, index) => (
            <li key={index} className="itinerary-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-time">{item.time}</span>
              </div>
              <button 
                className="remove-btn"
                onClick={() => onRemove(index)}
              >
                <FiMinus size={12} /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ServiceDetails = ({ service }) => {
  if (!service) return null;

  return (
    <div className="service-details">
      <h3>{service.name}</h3>
      
      <div className="detail-row">
        <span className="detail-label">Rating:</span>
        <span className="detail-value">
          <FiStar className="star-icon" /> {service.rating}
        </span>
      </div>
      
      <div className="detail-row">
        <span className="detail-label">Contact:</span>
        <span className="detail-value">{service.contact}</span>
      </div>
      
      {service.price && (
        <div className="detail-row">
          <span className="detail-label">Price:</span>
          <span className="detail-value">{service.price}</span>
        </div>
      )}
      
      {service.schedule && (
        <div className="detail-row">
          <span className="detail-label">Schedule:</span>
          <span className="detail-value">{service.schedule}</span>
        </div>
      )}
      
      {service.features && (
        <>
          <div className="detail-row">
            <span className="detail-label">Features:</span>
            <div className="features-list">
              {service.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          </div>
        </>
      )}
      
      <button className="action-btn">
        <FiNavigation size={16} /> Get Directions
      </button>
    </div>
  );
};

const ServiceCard = ({ service, isSelected, onClick }) => {
  const iconColors = {
    transport: '#3B82F6',
    bus: '#3B82F6',
    taxi: '#10B981',
    train: '#8B5CF6',
    bike: '#10B981',
    education: '#F59E0B',
    school: '#F59E0B',
    university: '#F59E0B',
    health: '#EF4444',
    hospital: '#EF4444',
    clinic: '#EF4444',
    entertainment: '#8B5CF6',
    mall: '#8B5CF6',
    restaurant: '#8B5CF6'
  };

  return (
    <div 
      className={`service-card ${isSelected ? 'selected' : 'unselected'}`}
      onClick={() => onClick(service)}
    >
      <div className="service-card-content">
        <div 
          className="service-icon" 
          style={{ 
            backgroundColor: `${iconColors[service.type]}20`,
            color: iconColors[service.type]
          }}
        >
          {service.icon}
        </div>
        <div>
          <h3 className="service-name">{service.name}</h3>
          <div className="service-meta">
            <FiStar className="star-icon" />
            <span>{service.rating}</span>
            <span className="divider">•</span>
            <span>{service.price || service.fees || "See pricing"}</span>
          </div>
          <div className="service-meta">
            <FiClock />
            <span>{service.schedule || "Check schedule"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function UrbanFlow() {
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("transport");
  const [transportType, setTransportType] = useState("all");
  const [showMap, setShowMap] = useState(false);
  const [itinerary, setItinerary] = useState([]);

  const handlePlanRoute = (routeDetails) => {
    const suggestedRoutes = [
      {
        id: Date.now(),
        name: `${routeDetails.start} to ${routeDetails.end}`,
        transportType: "bus",
        duration: "35 min",
        price: "Ksh 120",
        time: new Date().toLocaleTimeString(),
        steps: [
          "Walk to bus stop (5 min)",
          "Take Route 23 to Downtown (15 min)",
          "Transfer to Route 42 (10 min)",
          "Walk to destination (5 min)"
        ]
      }
    ];
    
    setItinerary(prev => [...prev, ...suggestedRoutes]);
  };

  const handleHireBike = (station) => {
    const hireDetails = {
      id: Date.now(),
      name: `Bike hire at ${station.name}`,
      time: new Date().toLocaleTimeString(),
      price: station.price,
      station: station.name
    };
    
    setItinerary(prev => [...prev, hireDetails]);
  };

  const removeFromItinerary = (index) => {
    setItinerary(prev => prev.filter((_, i) => i !== index));
  };

  const filteredServices = services[activeCategory]?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categories = [
    { id: "transport", name: "Transport" },
    { id: "education", name: "Education" },
    { id: "health", name: "Health" },
    { id: "entertainment", name: "Entertainment" }
  ];

  return (
    <div className="urban-flow-container">
      <style>{styles}</style>
      
      {/* Header */}
      <header className="header">
        <h1 className="app-title">
          <span>Urban</span> Flow
        </h1>
        <p className="app-subtitle">Nairobi's Transport & Services Network</p>
        
        {/* Search Bar */}
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : 'inactive'}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Map Toggle Button */}
      <button
        className="map-toggle-btn"
        onClick={() => setShowMap(!showMap)}
      >
        <FiMap style={{ marginRight: '8px' }} />
        {showMap ? "Hide Map" : "Show Map"}
      </button>

      {/* Main Content */}
      <div>
        {/* Transport Section */}
        {activeCategory === "transport" && (
          <>
            <TransportTypeFilter 
              activeType={transportType}
              onChange={setTransportType}
            />
            
            <RoutePlanner onPlanRoute={handlePlanRoute} />
            
            {transportType === "bike" ? (
              <div className="services-container">
                <h2 className="services-title">Bike Hire Stations</h2>
                {services.bike.map(station => (
                  <BikeHireCard 
                    key={station.id}
                    station={station}
                    onHire={handleHireBike}
                  />
                ))}
              </div>
            ) : (
              <div className="services-container">
                <h2 className="services-title">
                  {transportType === "all" ? "All Transport" : 
                   transportType === "bus" ? "Bus Services" : "Taxi Services"}
                </h2>
                {filteredServices
                  .filter(service => transportType === "all" || service.type === transportType)
                  .map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onClick={(service) => {
                        setSelectedService(service);
                        setShowMap(true);
                      }}
                    />
                  ))
                }
              </div>
            )}
          </>
        )}

        {/* Other Categories */}
        {activeCategory !== "transport" && (
          <div className="services-container">
            <h2 className="services-title">
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onClick={(service) => {
                    setSelectedService(service);
                    setShowMap(true);
                  }}
                />
              ))
            ) : (
              <p className="no-services">No services found</p>
            )}
          </div>
        )}

        {/* Service Details */}
        {selectedService && <ServiceDetails service={selectedService} />}

        {/* Itinerary Panel */}
        <ItineraryPanel 
          items={itinerary}
          onRemove={removeFromItinerary}
        />

        {/* Map (Conditionally Rendered) */}
        {showMap && (
          <div className="map-container">
            <MapContainer 
              center={selectedService?.location || NAIROBI_CENTER} 
              zoom={selectedService ? 15 : 13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredServices.map(service => (
                <Marker
                  key={service.id}
                  position={service.location}
                  icon={createCustomIcon(
                    service.type === 'bus' ? '#3B82F6' :
                    service.type === 'taxi' ? '#10B981' :
                    service.type === 'train' ? '#8B5CF6' :
                    service.type === 'bike' ? '#10B981' :
                    service.type === 'school' ? '#F59E0B' :
                    service.type === 'hospital' ? '#EF4444' : '#8B5CF6'
                  )}
                  eventHandlers={{
                    click: () => setSelectedService(service)
                  }}
                >
                  <Popup>
                    <div style={{ width: '200px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                        {service.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                        <FiStar style={{ color: '#f59e0b', marginRight: '4px' }} />
                        <span>{service.rating}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <FiPhone style={{ color: '#9ca3af', marginRight: '8px' }} />
                          <span>{service.contact}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FiClock style={{ color: '#9ca3af', marginRight: '8px' }} />
                          <span>{service.schedule || "Check schedule"}</span>
                        </div>
                      </div>
                      <button style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 12px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        marginTop: '12px',
                        cursor: 'pointer'
                      }}>
                        <FiNavigation style={{ marginRight: '8px' }} />
                        Directions
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}