import { useState } from 'react';

export default function Food() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    {
      id: 1,
      name: 'Urban Bistro',
      cuisine: 'International',
      rating: 4.5,
      reviewCount: 243,
      deliveryTime: '20-30 min',
      priceRange: '$$',
      isFastDelivery: false
    },
    {
      id: 2,
      name: 'Pizza Express',
      cuisine: 'Italian',
      rating: 4.2,
      reviewCount: 156,
      deliveryTime: '15-25 min',
      priceRange: '$',
      isFastDelivery: true
    },
    {
      id: 3,
      name: 'Burger Palace',
      cuisine: 'American',
      rating: 4.0,
      reviewCount: 189,
      deliveryTime: '10-20 min',
      priceRange: '$',
      isFastDelivery: true
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filter by active filter
    if (activeFilter === 'fast' && !restaurant.isFastDelivery) return false;
    if (activeFilter === 'rating' && restaurant.rating < 4) return false;
    if (activeFilter === 'price' && restaurant.priceRange !== '$') return false;
    
    // Filter by search query
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="page-container">
      <h1>Food Marketplace</h1>
      
      <div className="search-bar mb-2">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="food-filters mb-2">
        <button 
          className={activeFilter === 'all' ? 'active' : ''}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={activeFilter === 'fast' ? 'active' : ''}
          onClick={() => setActiveFilter('fast')}
        >
          Fast Delivery
        </button>
        <button 
          className={activeFilter === 'rating' ? 'active' : ''}
          onClick={() => setActiveFilter('rating')}
        >
          Rating 4.0+
        </button>
        <button 
          className={activeFilter === 'price' ? 'active' : ''}
          onClick={() => setActiveFilter('price')}
        >
          Under $10
        </button>
      </div>
      
      {filteredRestaurants.length > 0 ? (
        <div className="food-grid">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="food-card">
              <div className="food-card-header">
                <h3>{restaurant.name}</h3>
                <span className="delivery-time">{restaurant.deliveryTime}</span>
              </div>
              
              <div className="food-card-body">
                <div className="rating-price">
                  <span className="rating">⭐ {restaurant.rating} ({restaurant.reviewCount})</span>
                  <span className="price-range">{restaurant.priceRange}</span>
                </div>
                <p className="cuisine">{restaurant.cuisine}</p>
              </div>
              
              <button className="btn btn-outline">View Menu</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No restaurants found matching your criteria</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}