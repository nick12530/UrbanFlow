import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiSearch, FiStar, FiPhone, FiClock, FiNavigation, 
  FiMap, FiPlus, FiMinus, FiUser, FiCalendar, FiCreditCard,
  FiSun, FiMoon, FiX, FiChevronRight, FiMapPin
} from 'react-icons/fi';
import { 
  FaBus, FaTaxi, FaSchool, FaHospital, FaTrain, 
  FaSubway, FaBicycle, FaClinicMedical, FaUniversity,
  FaWalking, FaCar, FaMotorcycle
} from 'react-icons/fa';
import { MdLocalPharmacy, MdRestaurant, MdShoppingCart, MdDirections } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Nairobi coordinates
const NAIROBI_CENTER = [-1.286389, 36.817223];

// Service Images (placeholder URLs - in a real app, use actual image URLs)
const SERVICE_IMAGES = {
  bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  taxi: 'https://images.unsplash.com/photo-1628947733273-cdae71c9bfd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGF4aXxlbnwwfHwwfHx8MA%3D%3D',
  train: 'https://images.unsplash.com/photo-1601999007938-f584b47324ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYWlufGVufDB8fDB8fHww',
  bike: 'https://images.unsplash.com/photo-1559289431-9f12ee08f8b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdG9yY3ljbGV8ZW58MHx8MHx8fDA%3D',
  school: 'https://plus.unsplash.com/premium_photo-1723662156030-a1a5de3c80b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEyfHxoaWdoJTIwc2Nob29sJTIwdW5pZm9ybXxlbnwwfHwwfHx8MA%3D%3D',
  university: 'https://images.unsplash.com/photo-1720525200240-17cd4ffd127f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHVuaXZlcnNpdHklMjBjYW1wdXN8ZW58MHx8MHx8fDA%3D',
  hospital: 'https://images.unsplash.com/photo-1666887360742-d9280ba23bd7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAyfHxoZWFsdGhjYXJlfGVufDB8fDB8fHww',
  clinic: 'https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fGhlYWx0aGNhcmV8ZW58MHx8MHx8fDA%3D',
  mall: 'https://images.unsplash.com/photo-1662369801124-0ed1e584c331?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNob3BwaW5nJTIwbWFsbHxlbnwwfHwwfHx8MA%3D%3D',
  restaurant: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D'
};

// Enhanced Services Data with images
const services = {
  transport: [
    {
      id: 1,
      name: "Metro Transit Buses",
      type: "bus",
      icon: <FaBus size={20} />,
      image: SERVICE_IMAGES.bus,
      routes: [
        { name: "CBD to Westlands", duration: "25 min", stops: 8, price: "Ksh 50" },
        { name: "CBD to Karen", duration: "35 min", stops: 12, price: "Ksh 80" },
        { name: "CBD to Thika", duration: "50 min", stops: 15, price: "Ksh 120" }
      ],
      contact: "0722000001",
      location: [-1.266, 36.807],
      rating: 4.2,
      reviews: 124,
      schedule: "5:30 AM - 10:30 PM",
      features: ["AC buses", "Mobile payment", "Priority seating", "Free WiFi"],
      operator: "Nairobi Metro Transit",
      popularRoutes: ["Westlands", "Karen", "Thika"],
      paymentMethods: ["M-Pesa", "Cash", "Transport Card"]
    },
    {
      id: 2,
      name: "Nairobi Taxi Network",
      type: "taxi",
      icon: <FaTaxi size={20} />,
      image: SERVICE_IMAGES.taxi,
      vehicleTypes: [
        { name: "Standard", price: "Ksh 300 base + Ksh 50/km", seats: 4 },
        { name: "Executive", price: "Ksh 500 base + Ksh 80/km", seats: 4 },
        { name: "XL", price: "Ksh 700 base + Ksh 100/km", seats: 6 }
      ],
      contact: "0722000002",
      location: [-1.276, 36.817],
      rating: 4.5,
      reviews: 89,
      schedule: "24/7",
      features: ["Child seats", "English-speaking drivers", "Phone chargers", "Air conditioned"],
      operator: "Nairobi Taxi Co-op",
      estimatedWait: "3-7 min",
      safetyFeatures: ["Driver verification", "Share trip details", "Emergency button"]
    },
    {
      id: 3,
      name: "Commuter Rail",
      type: "train",
      icon: <FaTrain size={20} />,
      image: SERVICE_IMAGES.train,
      routes: [
        { name: "Central to Syokimau", duration: "45 min", stops: 6, price: "Ksh 100" },
        { name: "Central to Ruiru", duration: "35 min", stops: 5, price: "Ksh 80" },
        { name: "Central to Embakasi", duration: "30 min", stops: 4, price: "Ksh 70" }
      ],
      contact: "0722000003",
      location: [-1.286, 36.827],
      rating: 4.3,
      reviews: 67,
      schedule: "6:00 AM - 9:00 PM (Weekdays), 7:00 AM - 8:00 PM (Weekends)",
      features: ["First class option", "Bike racks", "Restrooms", "Food vendors"],
      operator: "Kenya Railways",
      frequency: "Every 20-30 minutes",
      capacity: "500 passengers per train"
    },
    {
      id: 4,
      name: "Boda Boda Network",
      type: "bike",
      icon: <FaMotorcycle size={20} />,
      image: SERVICE_IMAGES.bike,
      pricing: [
        { name: "Short trip (0-3km)", price: "Ksh 100-200" },
        { name: "Medium trip (3-7km)", price: "Ksh 200-400" },
        { name: "Long trip (7+ km)", price: "Negotiable" }
      ],
      contact: "0722000004",
      location: [-1.2833, 36.8172],
      rating: 3.9,
      reviews: 42,
      schedule: "5:00 AM - 11:00 PM",
      features: ["Quick transport", "Helmets available", "Cash payment"],
      operator: "Nairobi Boda Association",
      safetyRating: "3.5/5",
      estimatedWait: "1-3 min"
    }
  ],
  bike: [
    {
      id: 101,
      name: "CBD Bike Station",
      type: "bike",
      icon: <FaBicycle size={20} />,
      image: SERVICE_IMAGES.bike,
      location: [-1.2833, 36.8172],
      bikesAvailable: 12,
      slotsAvailable: 8,
      price: "Ksh 200/hour or Ksh 1000/day",
      contact: "0722111222",
      rating: 4.4,
      reviews: 56,
      features: ["E-bikes available", "24/7 access", "Mobile app control"],
      paymentMethods: ["M-Pesa", "Credit Card", "Bike Share Pass"],
      distance: "0.2 km away",
      safetyFeatures: ["GPS tracking", "Built-in lights", "Adjustable helmets"]
    },
    {
      id: 102,
      name: "Westlands Bike Hub",
      type: "bike",
      icon: <FaBicycle size={20} />,
      image: SERVICE_IMAGES.bike,
      location: [-1.2633, 36.8062],
      bikesAvailable: 8,
      slotsAvailable: 5,
      price: "Ksh 250/hour or Ksh 1200/day",
      contact: "0722111333",
      rating: 4.6,
      reviews: 34,
      features: ["Premium bikes", "Repair stations", "Guided tours"],
      paymentMethods: ["M-Pesa", "Credit Card"],
      distance: "2.5 km away",
      safetyFeatures: ["Theft protection", "Emergency contact"]
    }
  ],
  education: [
    {
      id: 201,
      name: "Nairobi School",
      type: "school",
      icon: <FaSchool size={20} />,
      image: SERVICE_IMAGES.school,
      location: [-1.286, 36.827],
      rating: 4.8,
      reviews: 215,
      fees: "Ksh 50,000/term",
      contact: "0722333444",
      programs: ["Primary", "Secondary", "A-Levels"],
      facilities: ["Library", "Sports", "Computer Lab", "Science Labs"],
      admission: {
        requirements: ["Birth certificate", "Report cards", "Interview"],
        process: "Interview and assessment",
        deadlines: ["Term 1: Jan 15", "Term 2: May 10"]
      },
      distance: "3.2 km away",
      transportOptions: ["School buses", "Public transport", "Safe walking routes"]
    },
    {
      id: 202,
      name: "University of Nairobi",
      type: "university",
      icon: <FaUniversity size={20} />,
      image: SERVICE_IMAGES.university,
      location: [-1.276, 36.817],
      rating: 4.9,
      reviews: 342,
      fees: "Ksh 80,000/semester",
      contact: "0733444555",
      programs: ["Undergraduate", "Postgraduate", "PhD"],
      faculties: ["Medicine", "Engineering", "Business", "Law", "Arts"],
      campusFacilities: ["Libraries", "Hostels", "Sports complex", "Medical center"],
      transportHubs: ["Main gate shuttle", "Bus stop", "Bike share station"],
      notableAlumni: ["Current President", "Nobel Prize winner", "Tech entrepreneurs"]
    }
  ],
  health: [
    {
      id: 301,
      name: "Nairobi Hospital",
      type: "hospital",
      icon: <FaHospital size={20} />,
      image: SERVICE_IMAGES.hospital,
      location: [-1.296, 36.807],
      rating: 4.6,
      reviews: 178,
      contact: "0733555777",
      services: ["Emergency", "Pharmacy", "Consultation", "Surgery", "Maternity"],
      specialists: ["Cardiology", "Pediatrics", "Orthopedics", "Neurology"],
      insurance: ["NHIF", "AAR", "Jubilee", "Britam"],
      emergencyContact: "0733555777",
      visitingHours: "10:00 AM - 6:00 PM",
      parking: "Available (Ksh 200 first 2 hours)"
    },
    {
      id: 302,
      name: "Avenue Healthcare",
      type: "clinic",
      icon: <FaClinicMedical size={20} />,
      image: SERVICE_IMAGES.clinic,
      location: [-1.266, 36.797],
      rating: 4.4,
      reviews: 92,
      contact: "0711222333",
      services: ["Outpatient", "Lab Tests", "Vaccination", "Dental", "Optical"],
      operatingHours: {
        weekdays: "8:00 AM - 8:00 PM",
        weekends: "9:00 AM - 5:00 PM"
      },
      walkInPolicy: "First come first served",
      appointmentBooking: ["Phone", "Mobile app", "Website"],
      averageWaitTime: "15-30 minutes"
    }
  ],
  entertainment: [
    {
      id: 401,
      name: "The Hub Karen",
      type: "mall",
      icon: <MdShoppingCart size={20} />,
      image: SERVICE_IMAGES.mall,
      location: [-1.316, 36.707],
      rating: 4.3,
      reviews: 156,
      contact: "0722444666",
      facilities: ["Cinema", "Restaurants", "Shops", "Play area", "Banking"],
      openingHours: "9:00 AM - 10:00 PM",
      parking: "Available (Ksh 200 first 3 hours)",
      popularStores: ["Carrefour", "Java House", "Artcaffe", "Game"],
      events: ["Live music Fridays", "Kids activities weekends"],
      accessibility: ["Wheelchair access", "Elevators", "Family restrooms"]
    },
    {
      id: 402,
      name: "Carnivore Restaurant",
      type: "restaurant",
      icon: <MdRestaurant size={20} />,
      image: SERVICE_IMAGES.restaurant,
      location: [-1.326, 36.717],
      rating: 4.5,
      reviews: 287,
      contact: "0722555888",
      cuisine: ["African", "Grill", "Bar", "Vegetarian options"],
      priceRange: "Ksh 2,500 - Ksh 5,000",
      reservations: true,
      signatureDishes: ["Beast of a Feast", "Nyama Choma Platter", "Vegetarian Delight"],
      diningOptions: ["Outdoor seating", "Private rooms", "Buffet"],
      specialFeatures: ["Cultural shows", "Sunday brunch", "Wedding venue"]
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

// Theme colors
const lightTheme = {
  primary: '#2563eb',
  secondary: '#10b981',
  background: '#ffffff',
  cardBackground: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  accent: '#f3f4f6',
  shadow: 'rgba(0,0,0,0.1)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

const darkTheme = {
  primary: '#3b82f6',
  secondary: '#10b981',
  background: '#1f2937',
  cardBackground: '#374151',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#4b5563',
  accent: '#4b5563',
  shadow: 'rgba(0,0,0,0.3)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

// Component Styles
const getStyles = (theme) => `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s, color 0.3s;
  }

  body {
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    background-color: ${theme.background};
    color: ${theme.text};
  }

  .urban-flow-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: ${theme.background};
    min-height: 100vh;
  }
  
  .header {
    margin-bottom: 30px;
    position: relative;
  }
  
  .app-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${theme.text};
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .app-title span {
    color: ${theme.primary};
  }
  
  .app-subtitle {
    color: ${theme.textSecondary};
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
  
  .search-container {
    position: relative;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 14px 20px 14px 50px;
    border-radius: 12px;
    border: 1px solid ${theme.border};
    font-size: 16px;
    box-shadow: 0 1px 3px ${theme.shadow};
    background-color: ${theme.cardBackground};
    color: ${theme.text};
  }
  
  .search-input:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
  
  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.textSecondary};
    font-size: 20px;
  }
  
  .category-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none;
  }

  .category-filters::-webkit-scrollbar {
    display: none;
  }
  
  .category-btn {
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .category-btn.active {
    background-color: ${theme.primary};
    color: white;
  }
  
  .category-btn.inactive {
    background-color: ${theme.cardBackground};
    color: ${theme.text};
    border: 1px solid ${theme.border};
  }

  .category-btn.inactive:hover {
    background-color: ${theme.accent};
  }
  
  .map-toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: ${theme.cardBackground};
    border-radius: 12px;
    color: ${theme.text};
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px ${theme.shadow};
    border: 1px solid ${theme.border};
    cursor: pointer;
    transition: all 0.2s;
  }

  .map-toggle-btn:hover {
    background-color: ${theme.accent};
  }
  
  .services-container {
    background-color: ${theme.cardBackground};
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px ${theme.shadow};
    border: 1px solid ${theme.border};
    margin-bottom: 20px;
  }
  
  .services-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: ${theme.text};
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .services-title-icon {
    color: ${theme.primary};
  }
  
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .service-card {
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
    border: 1px solid ${theme.border};
    background-color: ${theme.cardBackground};
  }
  
  .service-card.selected {
    border: 2px solid ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px ${theme.shadow};
  }
  
  .service-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .service-card-content {
    padding: 16px;
  }
  
  .service-name {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${theme.text};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .service-meta {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${theme.textSecondary};
    margin-top: 4px;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .star-icon {
    color: #f59e0b;
    margin-right: 4px;
  }
  
  .divider {
    color: ${theme.textSecondary};
  }
  
  .map-container {
    background-color: ${theme.cardBackground};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px ${theme.shadow};
    height: 500px;
    margin-top: 20px;
    border: 1px solid ${theme.border};
  }
  
  .no-services {
    text-align: center;
    color: ${theme.textSecondary};
    padding: 40px 0;
    font-size: 1.1rem;
  }

  /* Transport Specific Styles */
  .transport-type-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: none;
  }

  .transport-type-filters::-webkit-scrollbar {
    display: none;
  }

  .transport-type-btn {
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    background: ${theme.accent};
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    color: ${theme.text};
    transition: all 0.2s;
  }

  .transport-type-btn.active {
    background: ${theme.primary};
    color: white;
  }

  .transport-type-btn:not(.active):hover {
    background: ${theme.border};
  }

  .route-planner {
    background: ${theme.accent};
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid ${theme.border};
  }

  .route-planner h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.25rem;
    color: ${theme.text};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .route-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .route-inputs input, .route-inputs select {
    padding: 12px;
    border: 1px solid ${theme.border};
    border-radius: 8px;
    font-size: 14px;
    background-color: ${theme.cardBackground};
    color: ${theme.text};
  }

  .route-inputs input:focus, .route-inputs select:focus {
    outline: none;
    border-color: ${theme.primary};
    box-shadow: 0 0 0 3px ${theme.primary}20;
  }

  .plan-route-btn {
    background: ${theme.primary};
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .plan-route-btn:hover {
    background: ${theme.info};
    transform: translateY(-2px);
  }

  .bike-hire-card {
    background: ${theme.cardBackground};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px ${theme.shadow};
    border: 1px solid ${theme.border};
    transition: all 0.2s;
  }

  .bike-hire-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px ${theme.shadow};
  }

  .bike-station-info h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: ${theme.text};
  }

  .bike-availability {
    display: flex;
    gap: 16px;
    margin: 8px 0;
    font-size: 14px;
    color: ${theme.textSecondary};
  }

  .bike-pricing {
    font-weight: 600;
    color: ${theme.text};
    margin-top: 4px;
  }

  .hire-btn {
    background: ${theme.secondary};
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .hire-btn:hover {
    background: #0d9c6e;
    transform: translateY(-2px);
  }

  /* Itinerary Styles */
  .itinerary-panel {
    background: ${theme.cardBackground};
    border-radius: 16px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 1px 3px ${theme.shadow};
    border: 1px solid ${theme.border};
  }

  .itinerary-panel h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: ${theme.text};
    display: flex;
    align-items: center;
    gap: 8px;
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
    padding: 16px 0;
    border-bottom: 1px solid ${theme.border};
  }

  .item-details {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .item-name {
    font-weight: 600;
    font-size: 15px;
    color: ${theme.text};
    margin-bottom: 4px;
  }

  .item-time {
    font-size: 14px;
    color: ${theme.textSecondary};
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .item-icon {
    margin-right: 8px;
    color: ${theme.primary};
  }

  .remove-btn {
    background: ${theme.danger}10;
    color: ${theme.danger};
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: ${theme.danger}20;
  }

  .empty-itinerary {
    color: ${theme.textSecondary};
    text-align: center;
    padding: 20px 0;
    font-size: 1rem;
  }

  .itinerary-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .action-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-action {
    background: ${theme.primary};
    color: white;
    border: none;
  }

  .primary-action:hover {
    background: ${theme.info};
    transform: translateY(-2px);
  }

  .secondary-action {
    background: ${theme.accent};
    color: ${theme.text};
    border: 1px solid ${theme.border};
  }

  .secondary-action:hover {
    background: ${theme.border};
  }

  /* Service Details Styles */
  .service-details {
    background: ${theme.cardBackground};
    border-radius: 16px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 1px 3px ${theme.shadow};
    border: 1px solid ${theme.border};
  }

  .service-details h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.5rem;
    color: ${theme.text};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .close-details {
    background: none;
    border: none;
    color: ${theme.textSecondary};
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
  }

  .detail-row {
    display: flex;
    margin-bottom: 12px;
    align-items: flex-start;
  }

  .detail-label {
    font-weight: 600;
    width: 120px;
    color: ${theme.textSecondary};
    flex-shrink: 0;
  }

  .detail-value {
    flex: 1;
    color: ${theme.text};
  }

  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .feature-tag {
    background: ${theme.accent};
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    color: ${theme.text};
  }

  .action-btn {
    background: ${theme.primary};
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: ${theme.info};
    transform: translateY(-2px);
  }

  .service-image-large {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  /* Dark mode toggle */
  .theme-toggle {
    background: none;
    border: none;
    color: ${theme.text};
    cursor: pointer;
    font-size: 24px;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .theme-toggle:hover {
    background: ${theme.accent};
  }

  /* Route steps */
  .route-steps {
    margin-top: 16px;
    padding-left: 16px;
  }

  .route-step {
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;
    color: ${theme.text};
  }

  .route-step:before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${theme.primary};
  }

  .route-step:after {
    content: "";
    position: absolute;
    left: 5px;
    top: 18px;
    width: 2px;
    height: calc(100% - 12px);
    background-color: ${theme.border};
  }

  .route-step:last-child:after {
    display: none;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .services-grid {
      grid-template-columns: 1fr;
    }

    .route-inputs {
      grid-template-columns: 1fr;
    }

    .app-title {
      font-size: 2rem;
    }
  }

  /* Leaflet popup styles */
  .leaflet-popup-content {
    margin: 12px;
    width: 250px !important;
  }

  .leaflet-popup-content h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: ${theme.text};
  }

  .leaflet-popup-content p {
    font-size: 0.9rem;
    color: ${theme.textSecondary};
    margin-bottom: 4px;
  }

  .leaflet-popup-content .popup-btn {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    background: ${theme.primary};
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 8px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
`;

// Components
const TransportTypeFilter = ({ activeType, onChange }) => {
  const types = [
    { id: "all", name: "All Transport", icon: <FaCar size={16} /> },
    { id: "bus", name: "Buses", icon: <FaBus size={16} /> },
    { id: "taxi", name: "Taxis", icon: <FaTaxi size={16} /> },
    { id: "train", name: "Trains", icon: <FaTrain size={16} /> },
    { id: "bike", name: "Bike Hire", icon: <FaBicycle size={16} /> }
  ];

  return (
    <div className="transport-type-filters">
      {types.map(type => (
        <button
          key={type.id}
          className={`transport-type-btn ${activeType === type.id ? 'active' : ''}`}
          onClick={() => onChange(type.id)}
        >
          {type.icon} {type.name}
        </button>
      ))}
    </div>
  );
};

const RoutePlanner = ({ onPlanRoute }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("fastest");

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlanRoute({ start, end, time, mode });
  };

  return (
    <div className="route-planner">
      <h3><FiNavigation size={20} /> Plan Your Route</h3>
      <form onSubmit={handleSubmit}>
        <div className="route-inputs">
          <input
            type="text"
            placeholder="Starting point (e.g. Westlands)"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Destination (e.g. CBD)"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="fastest">Fastest Route</option>
            <option value="cheapest">Cheapest Route</option>
            <option value="leastWalking">Least Walking</option>
          </select>
        </div>
        <button 
          type="submit"
          className="plan-route-btn"
        >
          <FiNavigation size={18} /> Find Best Route
        </button>
      </form>
    </div>
  );
};

const BikeHireCard = ({ station, onHire }) => {
  return (
    <div className="bike-hire-card">
      <div className="bike-station-info">
        <h4>{station.name}</h4>
        <div className="bike-availability">
          <span>🚴‍♀️ {station.bikesAvailable} Bikes</span>
          <span>🅿️ {station.slotsAvailable} Slots</span>
        </div>
        <div className="bike-pricing">{station.price}</div>
        <div className="service-meta">
          <FiMapPin size={14} /> {station.distance}
        </div>
      </div>
      <button 
        className="hire-btn"
        onClick={() => onHire(station)}
      >
        <FiCreditCard size={16} /> Hire
      </button>
    </div>
  );
};

const ItineraryPanel = ({ items, onRemove, onClear, onSave }) => {
  return (
    <div className="itinerary-panel">
      <h3><FiCalendar size={20} /> Your Itinerary</h3>
      {items.length === 0 ? (
        <p className="empty-itinerary">No items in your itinerary yet. Start adding services to plan your day!</p>
      ) : (
        <>
          <ul className="itinerary-list">
            {items.map((item, index) => (
              <li key={index} className="itinerary-item">
                <div className="item-details">
                  <div className="item-name">
                    {item.type === 'bike' ? <FaBicycle className="item-icon" /> : 
                     item.type === 'bus' ? <FaBus className="item-icon" /> :
                     item.type === 'taxi' ? <FaTaxi className="item-icon" /> :
                     item.type === 'train' ? <FaTrain className="item-icon" /> : 
                     <FiMapPin className="item-icon" />}
                    {item.name}
                  </div>
                  <div className="item-time">
                    <IoMdTime size={14} /> {item.time} • {item.price || 'Price varies'}
                  </div>
                  {item.steps && (
                    <div className="route-steps">
                      {item.steps.map((step, i) => (
                        <div key={i} className="route-step">{step}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => onRemove(index)}
                >
                  <FiX size={14} /> Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="itinerary-actions">
            <button className="action-btn secondary-action" onClick={onClear}>
              <FiX size={16} /> Clear All
            </button>
            <button className="action-btn primary-action" onClick={onSave}>
              <FiCalendar size={16} /> Save Itinerary
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ServiceDetails = ({ service, onClose, onAddToItinerary }) => {
  if (!service) return null;

  const renderTransportDetails = () => {
    if (service.type === 'bus' || service.type === 'train') {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">Routes:</span>
            <div className="detail-value">
              {service.routes.map((route, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <strong>{route.name}</strong> • {route.duration} • {route.price}
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {route.stops} stops
                  </div>
                </div>
              ))}
            </div>
          </div>
          {service.frequency && (
            <div className="detail-row">
              <span className="detail-label">Frequency:</span>
              <span className="detail-value">{service.frequency}</span>
            </div>
          )}
        </>
      );
    } else if (service.type === 'taxi') {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">Vehicle Types:</span>
            <div className="detail-value">
              {service.vehicleTypes.map((type, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <strong>{type.name}</strong> • {type.price} • {type.seats} seats
                </div>
              ))}
            </div>
          </div>
          {service.estimatedWait && (
            <div className="detail-row">
              <span className="detail-label">Estimated Wait:</span>
              <span className="detail-value">{service.estimatedWait}</span>
            </div>
          )}
        </>
      );
    } else if (service.type === 'bike') {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">Availability:</span>
            <span className="detail-value">{service.bikesAvailable} bikes, {service.slotsAvailable} slots</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Distance:</span>
            <span className="detail-value">{service.distance}</span>
          </div>
        </>
      );
    }
    return null;
  };

  const renderEducationDetails = () => {
    if (service.type === 'school' || service.type === 'university') {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">Programs:</span>
            <span className="detail-value">{service.programs.join(', ')}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Facilities:</span>
            <span className="detail-value">{service.facilities.join(', ')}</span>
          </div>
        </>
      );
    }
    return null;
  };

  const renderHealthDetails = () => {
    if (service.type === 'hospital' || service.type === 'clinic') {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">Services:</span>
            <span className="detail-value">{service.services.join(', ')}</span>
          </div>
          {service.operatingHours && (
            <div className="detail-row">
              <span className="detail-label">Hours:</span>
              <span className="detail-value">
                Weekdays: {service.operatingHours.weekdays}<br />
                Weekends: {service.operatingHours.weekends}
              </span>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  const renderEntertainmentDetails = () => {
    if (service.type === 'mall' || service.type === 'restaurant') {
      return (
        <>
          <div className="detail-row">
            <span className="detail-label">Facilities:</span>
            <span className="detail-value">{service.facilities?.join(', ')}</span>
          </div>
          {service.openingHours && (
            <div className="detail-row">
              <span className="detail-label">Opening Hours:</span>
              <span className="detail-value">{service.openingHours}</span>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="service-details">
      <h3>
        {service.name}
        <button className="close-details" onClick={onClose}>
          <FiX />
        </button>
      </h3>
      
      {service.image && (
        <img src={service.image} alt={service.name} className="service-image-large" />
      )}
      
      <div className="detail-row">
        <span className="detail-label">Rating:</span>
        <span className="detail-value">
          <FiStar className="star-icon" /> {service.rating} ({service.reviews} reviews)
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
      
      {renderTransportDetails()}
      {renderEducationDetails()}
      {renderHealthDetails()}
      {renderEntertainmentDetails()}
      
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
      
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          className="action-btn"
          onClick={() => {
            if (service.location && Array.isArray(service.location)) {
              const [lat, lng] = service.location;
              const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
              window.open(url, '_blank');
            }
          }}
        >
          <MdDirections size={18} /> Get Directions
        </button>
        <button
          className="action-btn secondary-action"
          onClick={() => onAddToItinerary?.(service)}
          aria-label="Add to itinerary"
          style={{ flex: 1 }}
        >
          <FiCalendar size={18} /> Add to Itinerary
        </button>
      </div>
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

  const getServiceTypeLabel = (type) => {
    switch(type) {
      case 'bus': return 'Bus Service';
      case 'taxi': return 'Taxi Service';
      case 'train': return 'Train Service';
      case 'bike': return 'Bike Hire';
      case 'school': return 'School';
      case 'university': return 'University';
      case 'hospital': return 'Hospital';
      case 'clinic': return 'Clinic';
      case 'mall': return 'Shopping Mall';
      case 'restaurant': return 'Restaurant';
      default: return 'Service';
    }
  };

  return (
    <div 
      className={`service-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(service)}
    >
      {service.image && (
        <img src={service.image} alt={service.name} className="service-image" />
      )}
      <div className="service-card-content">
        <h3 className="service-name">
          {service.name}
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#6b7280',
            backgroundColor: `${iconColors[service.type]}10`,
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            {getServiceTypeLabel(service.type)}
          </span>
        </h3>
        <div className="service-meta">
          <FiStar className="star-icon" />
          <span>{service.rating}</span>
          <span className="divider">•</span>
          <span>{service.reviews} reviews</span>
        </div>
        <div className="service-meta">
          <FiClock size={14} />
          <span>{service.schedule || "Check schedule"}</span>
        </div>
        <div className="service-meta">
          <FiPhone size={14} />
          <span>{service.contact}</span>
        </div>
        {service.distance && (
          <div className="service-meta">
            <FiMapPin size={14} />
            <span>{service.distance}</span>
          </div>
        )}
        {service.features && (
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {service.features.slice(0, 3).map((feature, index) => (
              <span key={index} style={{
                fontSize: '12px',
                backgroundColor: `${iconColors[service.type]}10`,
                color: iconColors[service.type],
                padding: '4px 8px',
                borderRadius: '12px'
              }}>
                {feature}
              </span>
            ))}
          </div>
        )}
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
  const [darkMode, setDarkMode] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(0);

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setShowRecentSearches(false);
    
    // Save to recent searches
    if (term.trim() && !recentSearches.includes(term.trim())) {
      const updatedSearches = [term.trim(), ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const handlePlanRoute = (routeDetails) => {
    const suggestedRoutes = [
      {
        id: Date.now(),
        name: `${routeDetails.start} to ${routeDetails.end}`,
        type: routeDetails.mode === 'cheapest' ? 'bus' : 'taxi',
        duration: routeDetails.mode === 'fastest' ? "25 min" : 
                routeDetails.mode === 'cheapest' ? "35 min" : "30 min",
        price: routeDetails.mode === 'fastest' ? "Ksh 350" : 
              routeDetails.mode === 'cheapest' ? "Ksh 80" : "Ksh 250",
        time: routeDetails.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: routeDetails.mode === 'fastest' ? [
          "Walk to taxi stand (3 min)",
          "Take taxi to destination (22 min)"
        ] : routeDetails.mode === 'cheapest' ? [
          "Walk to bus stop (5 min)",
          "Take Route 23 to Downtown (15 min)",
          "Transfer to Route 42 (10 min)",
          "Walk to destination (5 min)"
        ] : [
          "Walk to bus stop (3 min)",
          "Take Express Bus to destination (25 min)",
          "Walk to final location (2 min)"
        ]
      }
    ];
    
    setItinerary(prev => [...prev, ...suggestedRoutes]);
  };

  const addServiceToItinerary = (service) => {
    const entry = {
      id: Date.now(),
      name: service.name,
      type: service.type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: service.price || undefined,
      steps: undefined,
    };
    setItinerary(prev => [...prev, entry]);
  };

  const handleHireBike = (station) => {
    const hireDetails = {
      id: Date.now(),
      name: `Bike hire at ${station.name}`,
      type: 'bike',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: station.price,
      station: station.name
    };
    
    setItinerary(prev => [...prev, hireDetails]);
  };

  const removeFromItinerary = (index) => {
    setItinerary(prev => prev.filter((_, i) => i !== index));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  const saveItinerary = () => {
    try {
      localStorage.setItem('urbanflow_itinerary', JSON.stringify(itinerary));
      setLastSavedAt(Date.now());
      alert('Itinerary saved');
    } catch (_) {
      // ignore
    }
  };

  const filteredServices = services[activeCategory]?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.features && service.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
  ) || [];

  const categories = [
    { id: "transport", name: "Transport", icon: <FaBus size={18} /> },
    { id: "education", name: "Education", icon: <FaUniversity size={18} /> },
    { id: "health", name: "Health", icon: <FaHospital size={18} /> },
    { id: "entertainment", name: "Entertainment", icon: <MdShoppingCart size={18} /> }
  ];

  const getCategoryIcon = () => {
    switch(activeCategory) {
      case 'transport': return <FaBus className="services-title-icon" />;
      case 'education': return <FaUniversity className="services-title-icon" />;
      case 'health': return <FaHospital className="services-title-icon" />;
      case 'entertainment': return <MdShoppingCart className="services-title-icon" />;
      default: return <FiSearch className="services-title-icon" />;
    }
  };

  return (
    <div className="urban-flow-container">
      <style>{getStyles(theme)}</style>
      
      {/* Header */}
      <header className="header">
        <h1 className="app-title">
          <span>UrbanFlow</span> Transport
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </h1>
        <p className="app-subtitle">Nairobi's Complete Transport & Services Network</p>
        
        {/* Search Bar */}
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search services, routes, or features..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowRecentSearches(e.target.value === '');
            }}
            onFocus={() => searchTerm === '' && setShowRecentSearches(true)}
            onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
          />
          {showRecentSearches && recentSearches.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: theme.cardBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: '0 0 12px 12px',
              zIndex: 100,
              boxShadow: `0 4px 6px ${theme.shadow}`,
              padding: '8px 0'
            }}>
              <div style={{
                padding: '8px 16px',
                fontSize: '14px',
                color: theme.textSecondary
              }}>Recent searches</div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: theme.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur
                >
                  <FiSearch size={16} color={theme.textSecondary} />
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : 'inactive'}`}
            onClick={() => {
              setActiveCategory(category.id);
              if (category.id === 'transport') setTransportType('all');
            }}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Map Toggle Button */}
      <button
        className="map-toggle-btn"
        onClick={() => setShowMap(!showMap)}
      >
        <FiMap size={18} />
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
                <h2 className="services-title">
                  {getCategoryIcon()}
                  Bike Hire Stations
                </h2>
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
                  {getCategoryIcon()}
                  {transportType === "all" ? "All Transport Options" : 
                   transportType === "bus" ? "Bus Services" : 
                   transportType === "taxi" ? "Taxi Services" : "Train Services"}
                </h2>
                <div className="services-grid">
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
              </div>
            )}
          </>
        )}

        {/* Other Categories */}
        {activeCategory !== "transport" && (
          <div className="services-container">
            <h2 className="services-title">
              {getCategoryIcon()}
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <div className="services-grid">
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
                <p className="no-services">No services found matching your search</p>
              )}
            </div>
          </div>
        )}

        {/* Service Details */}
        {selectedService && (
          <ServiceDetails 
            service={selectedService} 
            onClose={() => setSelectedService(null)}
            onAddToItinerary={addServiceToItinerary}
          />
        )}

        {/* Itinerary Panel */}
        <ItineraryPanel 
          items={itinerary}
          onRemove={removeFromItinerary}
          onClear={clearItinerary}
          onSave={saveItinerary}
        />

        {/* Map (Conditionally Rendered) */}
        {showMap && (
          <div className="map-container">
            <MapContainer 
              center={selectedService?.location || NAIROBI_CENTER} 
              zoom={selectedService ? 15 : 13} 
              style={{ height: '100%', width: '100%' }}
            >
              <FitBounds services={filteredServices} selected={selectedService} />
              <TileLayer
                url={darkMode ? 
                  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : 
                  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
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
                    <div>
                      <h3>{service.name}</h3>
                      <p>
                        <FiStar style={{ color: '#f59e0b', marginRight: '4px' }} />
                        {service.rating} ({service.reviews} reviews)
                      </p>
                      <p>
                        <FiPhone style={{ marginRight: '4px' }} />
                        {service.contact}
                      </p>
                      <p>
                        <FiClock style={{ marginRight: '4px' }} />
                        {service.schedule || "Check schedule"}
                      </p>
                      <button className="popup-btn">
                        <MdDirections style={{ marginRight: '4px' }} />
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

function FitBounds({ services, selected }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (selected && selected.location) {
      map.setView(selected.location, 15, { animate: true });
      return;
    }
    if (services && services.length > 0) {
      const bounds = services
        .filter(s => Array.isArray(s.location))
        .map(s => s.location);
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 13);
      }
    }
  }, [map, JSON.stringify(services), selected?.id]);
  return null;
}