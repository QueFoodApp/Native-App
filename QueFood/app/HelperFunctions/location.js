import * as Location from 'expo-location';

export const getUserLocation = async (address) => {
  try {
    const geocode = await Location.geocodeAsync(address);
    if (geocode.length > 0) {
      const { latitude, longitude } = geocode[0];
      return { latitude, longitude };
    } else {
      console.log('No location found for the provided address.');
      return null;
    }
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }
};

const locationUtil = {
  getUserLocation,
};

export default locationUtil;