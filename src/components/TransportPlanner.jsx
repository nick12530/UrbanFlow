import { useState } from 'react';

export default function TransportPlanner({ onSearch }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch(origin, destination);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-group">
        <label htmlFor="origin">From</label>
        <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Enter starting point"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="destination">To</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        Find Routes
      </button>
    </form>
  );
}