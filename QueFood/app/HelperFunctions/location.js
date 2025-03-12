import * as Location from 'expo-location';

export const getUserLocation = async (address) => {
  try {
    const geocode = await Location.geocodeAsync(address);
    if (geocode.length > 0) {
      const { latitude, longitude } = geocode[0];
      console.log("Address in:", address);
      console.log("Location found:", latitude, longitude);
      return { latitude, longitude };
    } else {
      throw new Error('No location found for the provided address.');
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