import * as Location from 'expo-location';

export const getUserLocation = async () => {
  console.warn("⚠️ Using fake New York City location for testing.");
  // return { latitude: 33.5, longitude: -86.7 }; // NYC GPS coordinates
  // return { latitude: 47.6689212, longitude: -122.3839731 }; // Seattle GPS coordinates
  return { latitude: 42.8522855, longitude: -106.2717718 }; // Restaurant ID = 87, radius = 300 km 
  
};

const locationUtil = {
  getUserLocation,
};

export default locationUtil;