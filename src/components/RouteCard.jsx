export default function RouteCard({ route }) {
  return (
    <div className="card mb-2">
      <div className="route-header">
        <h3>{route.name}</h3>
        <span className="price-badge">{route.price}</span>
      </div>
      
      <div className="route-timing">
        <span>{route.departure}</span>
        <span className="duration">{route.duration}</span>
        <span>{route.arrival}</span>
      </div>
      
      <div className="route-details">
        <span>🚏 {route.stops} stops</span>
        {route.features.map((feature, index) => (
          <span key={index} className="feature-tag">✓ {feature}</span>
        ))}
      </div>
      
      <button className="btn btn-primary mt-1">
        Select Route
      </button>
    </div>
  );
}