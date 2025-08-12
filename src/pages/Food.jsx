import React, { useState } from 'react';
import { 
  FiSearch, FiClock, FiStar, FiDollarSign, FiMapPin, 
  FiPhone, FiHeart, FiShare2, FiNavigation, FiX 
} from 'react-icons/fi';
import { 
  FaMotorcycle, FaHamburger, FaUtensils, FaPizzaSlice,
  FaWhatsapp, FaLeaf, FaPepperHot, FaCoffee, FaCheese
} from 'react-icons/fa';
import { 
  GiAfrica, GiMeal, GiChopsticks, GiChickenOven, GiMeat,
  GiFullPizza, GiPlantRoots
} from 'react-icons/gi';
import { 
  MdStorefront, MdLocalCafe, MdLocalDining, MdFastfood 
} from 'react-icons/md';
import { IoFastFoodOutline } from 'react-icons/io5';

const Food = () => {
  // STATE
  const [activeTab, setActiveTab] = useState('restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeCuisine, setActiveCuisine] = useState('all');
  const [popupItem, setPopupItem] = useState(null);
  const placeOrder = (restaurant) => {
  if (restaurant.orderLink) {
    // Open restaurant's ordering page in new tab
    window.open(restaurant.orderLink, '_blank');
  } else {
    // Show message if no ordering link available
    alert(`Online ordering not available for ${restaurant.name}. Please call them directly at ${restaurant.contact}`);
  }
};

  // RESTAURANT DATA - 12 total restaurants
  const restaurants = [
    // African
    {
      id: 1,
      name: 'Nyama Mama - Westlands',
      type: 'restaurant',
      cuisine: 'african',
      icon: <GiAfrica />,
      rating: 4.7,
      reviewCount: 1842,
      deliveryTime: '25-40 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGdyaWxsZWQlMjBtZWF0fGVufDB8fDB8fHww',
      specialties: ['Nyama Choma', 'Ugali', 'Sukuma Wiki'],
      location: 'Delta Towers, Westlands',
      deliveryFee: 'Ksh 180',
      minOrder: 'Ksh 1000',
      openHours: '10:00 AM - 11:00 PM',
      contact: '020 440 0055',
      whatsapp: '+254 711 111 111',
      orderLink: 'https://nyamamakenya.com/order-online',
      features: ['Vegetarian Options', 'Bar', 'Outdoor Seating'],
      menu: [
        { 
          category: 'Main Dishes', 
          items: [
            { name: 'Nyama Choma Platter', price: 'Ksh 1450', popular: true },
            { name: 'Ugali & Sukuma Wiki', price: 'Ksh 650' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Carnivore Restaurant',
      type: 'restaurant',
      cuisine: 'african',
      icon: <GiMeat />,
      rating: 4.8,
      reviewCount: 3250,
      deliveryTime: '40-60 min',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80',
      specialties: ['Beast of a Feast', 'Game Meat', 'Nyama Choma'],
      location: 'Langata Road',
      deliveryFee: 'Ksh 250',
      minOrder: 'Ksh 1500',
      features: ['All-You-Can-Eat', 'Live Grill', 'Signature Dawa Cocktails'],
      menu: [{
        category: 'Signature Meats',
        items: [
          { name: 'Beast of a Feast Platter', price: 'Ksh 2200', popular: true },
          { name: 'Crocodile Skewers', price: 'Ksh 1800' }
        ]
      }]
    },

    // Fast Food Chains
    {
      id: 3,
      name: 'KFC - Thika Road',
      type: 'restaurant',
      cuisine: 'fastfood',
      icon: <MdFastfood />,
      rating: 4.3,
      reviewCount: 2250,
      deliveryTime: '20-35 min',
      priceRange: '$',
      image: 'https://images.unsplash.com/photo-1705472542518-7de5cddafbca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGtmY3xlbnwwfHwwfHx8MA%3D%3D',
      specialties: ['Bucket Meals', 'Zinger Burger', 'Hot Wings'],
      location: 'Thika Road Mall',
      deliveryFee: 'Ksh 150',
      minOrder: 'Ksh 500',
      openHours: '8:00 AM - 11:00 PM',
      contact: '020 123 4567',
      whatsapp: '+254 700 123 456',
      features: ['24/7 Delivery', 'Kids Meals', 'Spicy Options'],
      menu: [
        { 
          category: 'Meals', 
          items: [
            { name: '3 Piece Meal', price: 'Ksh 850', popular: true },
            { name: 'Zinger Burger Combo', price: 'Ksh 750' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Pizza Inn - Junction',
      type: 'restaurant',
      cuisine: 'italian',
      icon: <GiFullPizza />,
      rating: 4.2,
      reviewCount: 1980,
      deliveryTime: '30-45 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHBpenphfGVufDB8fDB8fHww',
      specialties: ['Peri-Peri Pizza', 'Garlic Bread', 'Chicken Wings'],
      location: 'The Junction Mall',
      deliveryFee: 'Ksh 200',
      minOrder: 'Ksh 900',
      openHours: '9:00 AM - 10:00 PM',
      contact: '020 765 4321',
      whatsapp: '+254 700 654 321',
      features: ['Family Meals', 'Vegetarian Options'],
      menu: [
        { 
          category: 'Pizzas', 
          items: [
            { name: 'Peri-Peri Chicken Pizza', price: 'Ksh 1400', popular: true },
            { name: 'Vegetarian Supreme', price: 'Ksh 1200' }
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Cafe Deli - Karen',
      type: 'restaurant',
      cuisine: 'cafe',
      icon: <MdLocalCafe />,
      rating: 4.5,
      reviewCount: 1320,
      deliveryTime: '25-40 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1662982693758-f69fcb81e7d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1ZmZldHxlbnwwfHwwfHx8MA%3D%3D',
      specialties: ['Artisan Coffee', 'Avocado Toast', 'Pancakes'],
      location: 'Karen Shopping Centre',
      deliveryFee: 'Ksh 180',
      minOrder: 'Ksh 700',
      openHours: '7:00 AM - 9:00 PM',
      contact: '0722 111 222',
      whatsapp: '+254 722 111 222',
      features: ['Free WiFi', 'Outdoor Seating', 'Vegetarian Friendly'],
      menu: [
        { 
          category: 'Breakfast', 
          items: [
            { name: 'Full English Breakfast', price: 'Ksh 1200', popular: true },
            { name: 'Avocado Toast', price: 'Ksh 850' }
          ]
        }
      ]
    },

    // Italian
    {
      id: 6,
      name: 'La Dolce Vita',
      type: 'restaurant',
      cuisine: 'italian',
      icon: <FaCheese />,
      rating: 4.6,
      reviewCount: 1560,
      deliveryTime: '35-50 min',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGl0YWxpYW4lMjBmb29kfGVufDB8fDB8fHww',
      specialties: ['Truffle Pasta', 'Wood-Fired Pizza', 'Tiramisu'],
      location: 'Westlands',
      deliveryFee: 'Ksh 220',
      minOrder: 'Ksh 1500',
      openHours: '11:00 AM - 11:00 PM',
      contact: '0723 333 444',
      whatsapp: '+254 723 333 444',
      features: ['Romantic Setting', 'Wine Pairings', 'Authentic Italian'],
      menu: [
        { 
          category: 'Pasta', 
          items: [
            { name: 'Truffle Tagliatelle', price: 'Ksh 1800', popular: true },
            { name: 'Spaghetti Carbonara', price: 'Ksh 1600' }
          ]
        }
      ]
    },

    // Vegetarian
    {
      id: 7,
      name: 'Green Terrace',
      type: 'restaurant',
      cuisine: 'vegetarian',
      icon: <GiPlantRoots />,
      rating: 4.7,
      reviewCount: 980,
      deliveryTime: '25-40 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1606307305578-9f4121dde6d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnZXRlcmlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D',
      specialties: ['Vegan Burgers', 'Buddha Bowls', 'Fresh Juices'],
      location: 'Kilimani',
      deliveryFee: 'Ksh 150',
      minOrder: 'Ksh 800',
      openHours: '8:00 AM - 9:00 PM',
      contact: '0724 555 666',
      whatsapp: '+254 724 555 666',
      features: ['100% Plant-Based', 'Organic Ingredients', 'Gluten-Free Options'],
      menu: [
        { 
          category: 'Healthy Bowls', 
          items: [
            { name: 'Quinoa Power Bowl', price: 'Ksh 1350', popular: true },
            { name: 'Vegan Buddha Bowl', price: 'Ksh 1250' }
          ]
        }
      ]
      
    },
    {
      id: 8,
      name: 'Cascade - Yaya Centre',
      type: 'restaurant',
      cuisine: 'vegetarian',
      icon: <FaLeaf />,
      rating: 4.4,
      reviewCount: 1120,
      deliveryTime: '30-45 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
      specialties: ['Vegetable Curry', 'Stir Fry', 'Fresh Salads'],
      location: 'Yaya Centre',
      deliveryFee: 'Ksh 180',
      minOrder: 'Ksh 900',
      openHours: '10:00 AM - 10:00 PM',
      contact: '0725 777 888',
      whatsapp: '+254 725 777 888',
      features: ['Vegetarian Options', 'Healthy Choices'],
      menu: [
        { 
          category: 'Main Dishes', 
          items: [
            { name: 'Vegetable Curry with Rice', price: 'Ksh 1100', popular: true },
            { name: 'Tofu Stir Fry', price: 'Ksh 950' }
          ]
        }
      ]
    }
  ];

  // MARKET DATA - 5 total markets
  const markets = [
    {
      id: 101,
      name: 'Maasai Market - Village Market',
      type: 'market',
      rating: 4.5,
      reviewCount: 632,
      image: 'https://images.unsplash.com/photo-1584208632776-bc16f862b0b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1hcmtldHBsYWNlfGVufDB8fDB8fHww',
      specialties: ['Fresh Produce', 'Spices', 'Handicrafts'],
      location: 'Village Market, Limuru Road',
      openHours: '9:00 AM - 6:00 PM (Fridays)',
      contact: '0720 123 456',
      whatsapp: '+254 720 123 456',
      features: ['Organic', 'Bargaining', 'Local Artisans'],
      priceExamples: [
        { item: 'Wooden Carving', price: 'Ksh 500-2000' },
        { item: 'Fresh Spices', price: 'Ksh 100-500' }
      ],
      tips: [
        'Bargaining is expected (start at 50% of asking price)',
        'Bring cash (most vendors don\'t accept mobile money)'
      ]
    },
    {
      id: 102,
      name: 'City Market Nairobi',
      type: 'market',
      rating: 4.3,
      reviewCount: 850,
      image: 'https://images.unsplash.com/photo-1639887603688-ef66ab7417a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFya2V0JTIwb3BlbnxlbnwwfHwwfHx8MA%3D%3D',
      specialties: ['Fresh Seafood', 'Butchery', 'Spices'],
      location: 'Muindi Mbingu Street',
      openHours: '7:00 AM - 6:00 PM (Daily)',
      features: ['Historic Market', 'Best Meat Selection', 'Central Location'],
      priceExamples: [
        { item: 'Fresh Tilapia', price: 'Ksh 300-500 per kg' },
        { item: 'Prime Beef', price: 'Ksh 600-900 per kg' }
      ],
      tips: [
        'Best time for seafood is early morning',
        'Butchers will cut meat to your specifications'
      ]
    },
    {
      id: 103,
      name: 'Kariakor Market',
      type: 'market',
      rating: 4.2,
      reviewCount: 720,
      image: 'https://images.unsplash.com/photo-1594300396215-3f0acf19e5ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhZCUyMHByb2R1Y3RzfGVufDB8fDB8fHww',
      specialties: ['African Fabrics', 'Tailoring Services', 'Beadwork'],
      location: 'Kariakor Area',
      openHours: '8:00 AM - 5:00 PM (Mon-Sat)',
      features: ['Custom Clothing', 'Authentic Maasai Crafts'],
      priceExamples: [
        { item: 'Kitenge Fabric', price: 'Ksh 400-800 per meter' },
        { item: 'Custom Dress', price: 'Ksh 1500-3000' }
      ],
      tips: [
        'Bring a sample if you want something specific made',
        'Tailoring usually takes 2-3 days'
      ]
    },
    {
      id: 104,
      name: 'Muthurwa Market',
      type: 'market',
      rating: 4.0,
      reviewCount: 650,
      image: 'https://images.unsplash.com/photo-1650189761130-5e4a778e50d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1hcmtldHBsYWNlJTIwc3BpY2VzJTIwZ3JhaW5zfGVufDB8fDB8fHww',
      specialties: ['Fresh Produce', 'Grains', 'Spices'],
      location: 'Eastlands',
      openHours: '5:00 AM - 4:00 PM (Daily)',
      features: ['Best Prices', 'Wholesale Options', 'Local Experience'],
      priceExamples: [
        { item: 'Sukuma Wiki (per bunch)', price: 'Ksh 20-40' },
        { item: 'Rice (per kg)', price: 'Ksh 120-180' }
      ],
      tips: [
        'Best for bulk purchases',
        'Prices drop significantly after 2pm'
      ]
    },
    {
      id: 105,
      name: 'Maasai Market - The Hub',
      type: 'market',
      rating: 4.4,
      reviewCount: 930,
      image: 'https://images.unsplash.com/photo-1732543521240-756bf0e17dfa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGpld2VscnklMjBhbmQlMjB3b29kJTIwY2FydmluZ3N8ZW58MHx8MHx8fDA%3D',
      specialties: ['Beaded Jewelry', 'Wood Carvings', 'African Art'],
      location: 'Karen',
      openHours: '10:00 AM - 7:00 PM (Wed & Sat)',
      features: ['High Quality Crafts', 'Fixed Prices', 'Parking Available'],
      priceExamples: [
        { item: 'Handmade Necklace', price: 'Ksh 800-2000' },
        { item: 'Soapstone Carving', price: 'Ksh 1500-5000' }
      ],
      tips: [
        'Great for authentic souvenirs',
        'Artists often demonstrate their craft'
      ]
    }
  ];

  // CUISINE FILTERS
  const cuisines = [
    { id: 'all', name: 'All', icon: <FaUtensils /> },
    { id: 'african', name: 'African', icon: <GiAfrica /> },
    { id: 'cafe', name: 'Café', icon: <MdLocalCafe /> },
    { id: 'fastfood', name: 'Fast Food', icon: <IoFastFoodOutline /> },
    { id: 'italian', name: 'Italian', icon: <FaCheese /> },
    { id: 'vegetarian', name: 'Vegetarian', icon: <FaLeaf /> }
  ];

  // FILTER FUNCTION
  const filteredItems = (activeTab === 'restaurants' ? restaurants : markets)
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.specialties && item.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCuisine = activeTab !== 'restaurants' || activeCuisine === 'all' || item.cuisine === activeCuisine;
      return matchesSearch && matchesCuisine;
    });

  // TOGGLE FAVORITE
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // STYLES - Enhanced with hover effects and distinct colors
  const styles = {
    app: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif",
      background: '#f8f9fa',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
      borderRadius: '16px',
      color: 'white',
      boxShadow: '0 10px 30px rgba(255,107,107,0.3)'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      margin: '0 0 1rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: '0.9',
      margin: '0'
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    },
    tabButton: {
      padding: '1rem 2rem',
      border: 'none',
      background: 'white',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      background: '#ff6b6b',
      color: 'white',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(255,107,107,0.4)'
    },
    marketTab: {
      background: '#48bb78',
      color: 'white',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(72,187,120,0.4)'
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      borderRadius: '50px',
      padding: '0.5rem 1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto 2rem',
      transition: 'all 0.3s ease'
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      padding: '0.8rem 1rem',
      fontSize: '1rem',
      width: '100%'
    },
    cuisineFilters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.8rem',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    cuisineButton: {
      padding: '0.8rem 1.5rem',
      background: 'white',
      border: 'none',
      borderRadius: '50px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    activeCuisine: {
      background: '#ff6b6b',
      color: 'white',
      boxShadow: '0 6px 20px rgba(255,107,107,0.4)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem',
      padding: '1rem'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      cursor: 'pointer'
    },
    cardImage: {
      width: '100%',
      height: '250px',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 0.5s ease'
    },
    favoriteButton: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: 'rgba(255,255,255,0.8)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      zIndex: 10
    },
    favorited: {
      color: '#ff6b6b',
      fill: '#ff6b6b'
    },
    cardContent: {
      padding: '1.5rem'
    },
    cardTitle: {
      margin: '0 0 1rem',
      fontSize: '1.5rem',
      fontWeight: '700'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#ffc107',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    priceRange: {
      display: 'inline-block',
      padding: '0.3rem 0.8rem',
      background: '#e9ecef',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    location: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#6c757d',
      marginBottom: '1rem'
    },
    specialties: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    specialtyTag: {
      padding: '0.4rem 0.8rem',
      background: '#f8f9fa',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    viewMoreButton: {
      background: 'none',
      border: 'none',
      color: '#ff6b6b',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    details: {
      padding: '1.5rem',
      background: '#f8f9fa',
      borderRadius: '0 0 16px 16px',
      marginTop: '1rem'
    },
    detailsTitle: {
      fontSize: '1.2rem',
      margin: '0 0 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.8rem 0',
      borderBottom: '1px solid #e9ecef'
    },
    popularBadge: {
      background: '#fff3bf',
      color: '#e67700',
      fontSize: '0.8rem',
      padding: '0.2rem 0.5rem',
      borderRadius: '50px',
      marginLeft: '0.5rem'
    },
    contactButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.8rem 1.2rem',
      background: '#ff6b6b',
      color: 'white',
      borderRadius: '50px',
      textDecoration: 'none',
      marginRight: '0.8rem',
      marginTop: '0.8rem',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease'
    },
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    popupContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6c757d'
    },
    noResults: {
      gridColumn: '1 / -1', 
      textAlign: 'center', 
      padding: '3rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }
  };

  // Hover effects that can't be in the style object
  const hoverStyles = {
    tabButtonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
    },
    cuisineButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
    },
    cardImageHover: {
      transform: 'scale(1.05)'
    },
    favoriteButtonHover: {
      background: 'rgba(255,255,255,1)',
      transform: 'scale(1.1)'
    },
    specialtyTagHover: {
      background: '#e9ecef'
    },
    viewMoreButtonHover: {
      color: '#e63946',
      transform: 'translateX(5px)'
    },
    contactButtonHover: {
      background: '#e63946',
      transform: 'translateY(-2px)'
    },
    closeButtonHover: {
      color: '#ff6b6b'
    },
    searchBarHover: {
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
    }
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>Nairobi Bites & Delights</h1>
        <p style={styles.subtitle}>Discover the vibrant flavors of Kenya's capital</p>
      </header>

      {/* TABS */}
      <div style={styles.tabs}>
        <button 
          style={{
            ...styles.tabButton,
            ...(activeTab === 'restaurants' ? styles.activeTab : {}),
            ':hover': hoverStyles.tabButtonHover
          }}
          onClick={() => setActiveTab('restaurants')}
        >
          <FaUtensils /> Restaurants
        </button>
        <button 
          style={{
            ...styles.tabButton,
            ...(activeTab === 'markets' ? styles.marketTab : {}),
            ':hover': hoverStyles.tabButtonHover
          }}
          onClick={() => setActiveTab('markets')}
        >
          <MdStorefront /> Markets
        </button>
      </div>

      {/* SEARCH */}
      <div style={{...styles.searchBar, ':hover': hoverStyles.searchBarHover}}>
        <FiSearch style={{ color: '#6c757d' }} />
        <input
          type="text"
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CUISINE FILTERS */}
      {activeTab === 'restaurants' && (
        <div style={styles.cuisineFilters}>
          {cuisines.map(cuisine => (
            <button
              key={cuisine.id}
              style={{
                ...styles.cuisineButton,
                ...(activeCuisine === cuisine.id ? styles.activeCuisine : {}),
                ':hover': hoverStyles.cuisineButtonHover
              }}
              onClick={() => setActiveCuisine(cuisine.id)}
            >
              {cuisine.icon} {cuisine.name}
            </button>
          ))}
        </div>
      )}

      {/* MAIN GRID */}
      <div style={styles.grid}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              style={{
                ...styles.card,
                ...(item.type === 'market' ? { borderTop: '4px solid #48bb78' } : { borderTop: '4px solid #ff6b6b' }),
                ':hover': hoverStyles.cardHover
              }}
              onClick={() => setPopupItem(item)}
            >
              {/* CARD IMAGE */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    ...styles.cardImage,
                    ':hover': hoverStyles.cardImageHover
                  }} 
                />
                <button 
                  style={{
                    ...styles.favoriteButton,
                    ':hover': hoverStyles.favoriteButtonHover
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  <FiHeart style={favorites.includes(item.id) ? styles.favorited : {}} />
                </button>
              </div>

              {/* CARD CONTENT */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{item.name}</h3>
                
                <div style={styles.rating}>
                  <FiStar /> {item.rating} ({item.reviewCount})
                </div>
                
                {item.priceRange && (
                  <span style={{
                    ...styles.priceRange,
                    ...(item.priceRange === '$$$' ? { background: '#fef3c7', color: '#92400e' } : 
                        item.priceRange === '$$' ? { background: '#dbeafe', color: '#1e40af' } : 
                        { background: '#dcfce7', color: '#166534' })
                  }}>
                    {item.priceRange === '$' ? 'Budget' : 
                     item.priceRange === '$$' ? 'Mid-Range' : 
                     'Premium'}
                  </span>
                )}
                
                <div style={styles.location}>
                  <FiMapPin /> {item.location}
                </div>
                
                {item.type === 'restaurant' && (
                  <div style={{ ...styles.location, marginBottom: '1.5rem' }}>
                    <FaMotorcycle /> {item.deliveryTime} • {item.deliveryFee} delivery
                  </div>
                )}
                
                <div style={styles.specialties}>
                  {item.specialties.slice(0, 3).map((specialty, index) => (
                    <span 
                      key={index} 
                      style={{
                        ...styles.specialtyTag,
                        ...(item.type === 'market' ? { 
                          background: '#48bb7833', 
                          color: '#2f855a' 
                        } : { 
                          background: '#ff6b6b33', 
                          color: '#c53030' 
                        }),
                        ':hover': hoverStyles.specialtyTagHover
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <button 
                  style={{
                    ...styles.viewMoreButton,
                    ':hover': hoverStyles.viewMoreButtonHover
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedItem(expandedItem === item.id ? null : item.id);
                  }}
                >
                  {expandedItem === item.id ? 'Show less' : 'View details'}
                </button>

                {expandedItem === item.id && (
                  <div style={styles.details}>
                    <h4 style={styles.detailsTitle}>
                      <FiClock /> Open Hours
                    </h4>
                    <p>{item.openHours}</p>
                    
                    {item.type === 'restaurant' && (
                      <>
                        <h4 style={styles.detailsTitle}>
                          <FiDollarSign /> Minimum Order
                        </h4>
                        <p>{item.minOrder}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <h3>No {activeTab} found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              style={{
                ...styles.contactButton,
                marginTop: '1rem',
                padding: '0.8rem 1.5rem',
                ':hover': hoverStyles.contactButtonHover
              }}
              onClick={() => {
                setSearchQuery('');
                setActiveCuisine('all');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* POPUP MODAL */}
      {popupItem && (
        <div style={styles.popupOverlay} onClick={() => setPopupItem(null)}>
          <div style={styles.popupContent} onClick={e => e.stopPropagation()}>
            <button 
              style={{
                ...styles.closeButton,
                ':hover': hoverStyles.closeButtonHover
              }}
              onClick={() => setPopupItem(null)}
            >
              <FiX />
            </button>
            
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <img 
                src={popupItem.image} 
                alt={popupItem.name} 
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  objectFit: 'cover',
                  borderRadius: '12px'
                }} 
              />
              <div>
                <h2 style={{ margin: '0 0 0.5rem' }}>{popupItem.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={styles.rating}>
                    <FiStar /> {popupItem.rating} ({popupItem.reviewCount} reviews)
                  </div>
                  {popupItem.priceRange && (
                    <span style={{
                      ...styles.priceRange,
                      ...(popupItem.priceRange === '$$$' ? { background: '#fef3c7', color: '#92400e' } : 
                          popupItem.priceRange === '$$' ? { background: '#dbeafe', color: '#1e40af' } : 
                          { background: '#dcfce7', color: '#166534' })
                    }}>
                      {popupItem.priceRange === '$' ? 'Budget' : 
                       popupItem.priceRange === '$$' ? 'Mid-Range' : 
                       'Premium'}
                    </span>
                  )}
                </div>
                <div style={styles.location}>
                  <FiMapPin /> {popupItem.location}
                </div>
                {popupItem.type === 'restaurant' && (
                  <div style={{ ...styles.location, marginBottom: '0.5rem' }}>
                    <FaMotorcycle /> {popupItem.deliveryTime} • {popupItem.deliveryFee} delivery
                  </div>
                )}
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ margin: '0.5rem 0' }}><strong>Open:</strong> {popupItem.openHours}</p>
                  {popupItem.type === 'restaurant' && (
                    <p style={{ margin: '0.5rem 0' }}><strong>Min Order:</strong> {popupItem.minOrder}</p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ margin: '1.5rem 0' }}>
              <h3 style={styles.detailsTitle}>
                {popupItem.type === 'restaurant' ? <FaUtensils /> : <MdStorefront />}
                {popupItem.type === 'restaurant' ? ' Specialties' : ' Features'}
              </h3>
              <div style={styles.specialties}>
                {popupItem.specialties.map((specialty, index) => (
                  <span 
                    key={index} 
                    style={{
                      ...styles.specialtyTag,
                      ...(popupItem.type === 'market' ? { 
                        background: '#48bb7833', 
                        color: '#2f855a' 
                      } : { 
                        background: '#ff6b6b33', 
                        color: '#c53030' 
                      }),
                      ':hover': hoverStyles.specialtyTagHover
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {popupItem.type === 'restaurant' ? (
              <>
                <div style={{ margin: '1.5rem 0' }}>
                  <h3 style={styles.detailsTitle}>
                    <FaUtensils /> Menu Highlights
                  </h3>
                  {popupItem.menu.map((category, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{category.category}</h4>
                      {category.items.map((menuItem, i) => (
                        <div key={i} style={styles.menuItem}>
                          <div>
                            {menuItem.name}
                            {menuItem.popular && (
                              <span style={styles.popularBadge}>Popular</span>
                            )}
                          </div>
                          <div>{menuItem.price}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <h3 style={styles.detailsTitle}>
                    <FiPhone /> Contact
                  </h3>
                  <div>
                    <a 
                      href={`tel:${popupItem.contact}`} 
                      style={{
                        ...styles.contactButton,
                        ':hover': hoverStyles.contactButtonHover
                      }}
                    >
                      <FiPhone /> Call
                    </a>
                    <a 
                      href={`https://wa.me/${popupItem.whatsapp}`} 
                      style={{
                        ...styles.contactButton,
                        ':hover': hoverStyles.contactButtonHover
                      }}
                    >
                      <FaWhatsapp /> WhatsApp
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ margin: '1.5rem 0' }}>
                  <h3 style={styles.detailsTitle}>
                    <FiDollarSign /> Price Examples
                  </h3>
                  {popupItem.priceExamples.map((price, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem' }}>
                      <strong>{price.item}:</strong> {price.price}
                    </div>
                  ))}
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <h3 style={styles.detailsTitle}>
                    <FiMapPin /> Visiting Tips
                  </h3>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {popupItem.tips.map((tip, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Food;