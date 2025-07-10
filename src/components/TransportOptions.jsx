import { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import RouteCard from './RouteCard';

export default function TransportOptions({ routes, origin, destination }) {
  const [tabValue, setTabValue] = useState('all');
  
  const filteredRoutes = tabValue === 'all' 
    ? routes 
    : routes.filter(route => route.type === tabValue);

  return (
    <Box>
      <Tabs 
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All" value="all" />
        <Tab label="Bus" value="bus" />
        <Tab label="Walking" value="walking" />
        <Tab label="Bike" value="bike" />
        <Tab label="Car" value="car" />
      </Tabs>
      
      <Box sx={{ mt: 2 }}>
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <RouteCard key={route.id} route={route} />
          ))
        ) : (
          <Typography>No routes found for your selection</Typography>
        )}
      </Box>
    </Box>
  );
}