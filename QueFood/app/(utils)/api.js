import API_BASE_URL from '../../config'; 
import { getUserLocation } from './location';

export const fetchNearbyRestaurants = async () => {
  const location = await getUserLocation();
  if (!location) {
    console.error("Failed to get user location.");
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant?latitude=${location.latitude}&longitude=${location.longitude}&radius=300`
    );    

    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};
