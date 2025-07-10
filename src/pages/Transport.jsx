import { useState } from 'react';

// Mock TransportPlanner component
function TransportPlanner({ onSearch }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = () => {
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Journey</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Search Routes
        </button>
      </div>
    </div>
  );
}

// Mock RouteCard component
function RouteCard({ route, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 cursor-pointer hover:border-blue-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{route.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{route.type} • {route.stops} stops</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{route.price}</p>
          <p className="text-sm text-gray-500">{route.duration}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-sm text-gray-600">Departure</p>
          <p className="font-medium">{route.departure}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Arrival</p>
          <p className="font-medium">{route.arrival}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {route.features.map((feature, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ service, onMapClick }) {
  const getIcon = (type) => {
    switch(type) {
      case 'bike': return <span className="text-2xl">🚲</span>;
      case 'taxi': return <span className="text-2xl">🚕</span>;
      case 'health': return <span className="text-2xl">🏥</span>;
      case 'school': return <span className="text-2xl">🏫</span>;
      default: return <span className="text-2xl">📍</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getIcon(service.type)}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.category}</p>
          </div>
        </div>
        <button
          onClick={() => onMapClick(service)}
          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors text-lg"
        >
          📍
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-xs">🕒</span>
          <span>{service.hours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-xs">📞</span>
          <span>{service.phone}</span>
        </div>
        {service.rating && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-500 text-xs">⭐</span>
            <span className="text-gray-600">{service.rating}/5 ({service.reviews} reviews)</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-3">{service.description}</p>

      {service.features && (
        <div className="flex flex-wrap gap-2">
          {service.features.map((feature, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
      )}

      {service.price && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-green-600">{service.price}</p>
        </div>
      )}
    </div>
  );
}

export default function Transport() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('routes');

  // Mock services data
  const services = {
    bike: [
      {
        id: 1,
        name: 'CityBike Rental',
        category: 'Bike Rental',
        type: 'bike',
        hours: '6:00 AM - 10:00 PM',
        phone: '+1 (555) 123-4567',
        rating: 4.5,
        reviews: 142,
        description: 'Electric and standard bikes available for hourly or daily rental.',
        features: ['Electric bikes', 'Helmet included', 'GPS tracking'],
        price: 'From $5/hour',
        coordinates: [51.505, -0.09]
      },
      {
        id: 2,
        name: 'EcoWheels Station',
        category: 'Bike Share',
        type: 'bike',
        hours: '24/7',
        phone: '+1 (555) 987-6543',
        rating: 4.2,
        reviews: 89,
        description: 'Sustainable bike sharing with multiple pickup locations.',
        features: ['Solar charging', 'App booking', 'Student discounts'],
        price: '$2/30 minutes',
        coordinates: [51.51, -0.1]
      }
    ],
    taxi: [
      {
        id: 3,
        name: 'QuickRide Taxi',
        category: 'Taxi Service',
        type: 'taxi',
        hours: '24/7',
        phone: '+1 (555) 456-7890',
        rating: 4.3,
        reviews: 267,
        description: 'Reliable taxi service with modern fleet and professional drivers.',
        features: ['Card payment', 'Airport service', 'Wheelchair accessible'],
        price: '$2.50 base + $1.80/mile',
        coordinates: [51.515, -0.1]
      },
      {
        id: 4,
        name: 'Metro Cabs',
        category: 'Premium Taxi',
        type: 'taxi',
        hours: '24/7',
        phone: '+1 (555) 234-5678',
        rating: 4.7,
        reviews: 198,
        description: 'Premium taxi service with luxury vehicles and executive drivers.',
        features: ['Luxury vehicles', 'Corporate accounts', 'Meet & greet'],
        price: '$5 base + $2.50/mile',
        coordinates: [51.5, -0.08]
      }
    ],
    health: [
      {
        id: 5,
        name: 'Central Medical Center',
        category: 'Hospital',
        type: 'health',
        hours: '24/7 Emergency',
        phone: '+1 (555) 911-0000',
        rating: 4.1,
        reviews: 324,
        description: 'Full-service hospital with emergency care and specialist services.',
        features: ['Emergency care', 'Specialists', 'Surgery center'],
        coordinates: [51.495, -0.07]
      },
      {
        id: 6,
        name: 'Family Health Clinic',
        category: 'Primary Care',
        type: 'health',
        hours: '8:00 AM - 6:00 PM',
        phone: '+1 (555) health-1',
        rating: 4.6,
        reviews: 156,
        description: 'Comprehensive primary care for families and individuals.',
        features: ['Walk-ins welcome', 'Preventive care', 'Pediatrics'],
        coordinates: [51.52, -0.11]
      }
    ],
    school: [
      {
        id: 7,
        name: 'Riverside Elementary',
        category: 'Elementary School',
        type: 'school',
        hours: '7:30 AM - 3:30 PM',
        phone: '+1 (555) school-1',
        rating: 4.4,
        reviews: 89,
        description: 'Public elementary school serving grades K-5 with excellent programs.',
        features: ['After-school care', 'Sports programs', 'Arts education'],
        coordinates: [51.508, -0.09]
      },
      {
        id: 8,
        name: 'Tech High School',
        category: 'High School',
        type: 'school',
        hours: '8:00 AM - 4:00 PM',
        phone: '+1 (555) school-2',
        rating: 4.5,
        reviews: 112,
        description: 'Modern high school with STEM focus and career preparation.',
        features: ['STEM programs', 'Career center', 'College prep'],
        coordinates: [51.512, -0.12]
      }
    ]
  };

  const handleSearch = (origin, destination) => {
    setLoading(true);
    setTimeout(() => {
      setRoutes([
        {
          id: 1,
          name: 'Express Bus 42',
          departure: '10:15 AM',
          arrival: '10:40 AM',
          duration: '25 min',
          price: '$2.50',
          type: 'bus',
          stops: 5,
          features: ['Wheelchair accessible', 'Air conditioning'],
          coordinates: [[51.505, -0.09], [51.51, -0.1], [51.515, -0.1]]
        },
        {
          id: 2,
          name: 'Downtown Loop',
          departure: 'Every 15 min',
          arrival: 'Flexible',
          duration: '40 min',
          price: '$3.00',
          type: 'bus',
          stops: 8,
          features: ['Free WiFi', 'USB Charging'],
          coordinates: [[51.505, -0.09], [51.5, -0.08], [51.495, -0.07]]
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleServiceMapClick = (service) => {
    setSelectedService(service);
    setShowMap(true);
  };

  const handleRouteMapClick = (route) => {
    setSelectedRoute(route);
    setSelectedService(null);
    setShowMap(true);
  };

  const tabs = [
    { id: 'routes', label: 'Routes', icon: '🚌' },
    { id: 'bike', label: 'Bike Hire', icon: '🚲' },
    { id: 'taxi', label: 'Taxi Services', icon: '🚕' },
    { id: 'health', label: 'Health Services', icon: '🏥' },
    { id: 'school', label: 'School Services', icon: '🏫' }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Urban Transport & Services Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your one-stop destination for transportation, bike rentals, taxi services, healthcare, and educational facilities
        </p>
      </div>

      {/* Transport Planner */}
      <section className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <TransportPlanner onSearch={handleSearch} />
      </section>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-md">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Routes Section */}
      {activeTab === 'routes' && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Routes</h2>
            {routes.length > 0 && (
              <button 
                onClick={() => handleRouteMapClick(routes[0])}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors shadow-md"
              >
                <span>📍</span> View Route Map
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600">Finding best routes...</p>
            </div>
          ) : routes.length > 0 ? (
            <div className="grid gap-4">
              {routes.map(route => (
                <RouteCard 
                  key={route.id} 
                  route={route}
                  onClick={() => handleRouteMapClick(route)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 p-8 rounded-xl text-center border-2 border-dashed border-blue-200">
              <p className="text-gray-700">Enter locations to find transport options</p>
            </div>
          )}
        </section>
      )}

      {/* Services Sections */}
      {activeTab !== 'routes' && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <div className="text-sm text-gray-600">
              {services[activeTab]?.length || 0} services available
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services[activeTab]?.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service}
                onMapClick={handleServiceMapClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedService?.name || selectedRoute?.name || 'Map View'}
              </h3>
              <button 
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-b-xl flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto text-5xl mb-4">📍</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">Interactive Map</h4>
                {selectedService ? (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <strong>{selectedService.name}</strong> - {selectedService.category}
                    </p>
                    <p className="text-gray-600">{selectedService.description}</p>
                    <p className="text-sm text-gray-500">
                      Location: {selectedService.coordinates[0]}, {selectedService.coordinates[1]}
                    </p>
                  </div>
                ) : selectedRoute ? (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Route: <strong>{selectedRoute.name}</strong>
                    </p>
                    <p className="text-gray-600">
                      {selectedRoute.departure} → {selectedRoute.arrival}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {selectedRoute.duration} | Price: {selectedRoute.price}
                    </p>
                  </div>
                ) : null}
                <p className="text-sm text-gray-500 mt-4">
                  Interactive map with real-time data would display here
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}