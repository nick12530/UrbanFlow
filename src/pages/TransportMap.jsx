import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Sample locations in New York
const locations = {
  timesSquare: [40.7580, -73.9855],
  centralPark: [40.7829, -73.9654],
  empireState: [40.7484, -73.9857],
  brooklynBridge: [40.7061, -73.9969],
  statenIslandFerry: [40.7026, -74.0144]
};

// Sample transport routes
const routes = [
  {
    name: "Downtown Express",
    coordinates: [
      locations.timesSquare,
      [40.7536, -73.9832],
      [40.7506, -73.9866],
      locations.brooklynBridge
    ],
    color: "blue"
  },
  {
    name: "Uptown Circle",
    coordinates: [
      locations.centralPark,
      [40.7752, -73.9748],
      [40.7913, -73.9646],
      [40.8006, -73.9581],
      locations.centralPark
    ],
    color: "green"
  }
];

export default function TransportMap() {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      // Fit map to show all markers
      const bounds = L.latLngBounds(Object.values(locations));
      mapRef.current.fitBounds(bounds);
    }
  }, []);

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer
        center={locations.timesSquare}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Markers for locations */}
        {Object.entries(locations).map(([name, coords]) => (
          <Marker key={name} position={coords}>
            <Popup>
              <div style={{ textTransform: "capitalize" }}>
                {name.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Transport routes */}
        {routes.map((route, idx) => (
          <Polyline
            key={idx}
            positions={route.coordinates}
            color={route.color}
            weight={4}
          >
            <Popup>{route.name}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}