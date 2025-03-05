import * as Location from 'expo-location';

// export const getUserLocation = async () => {
//   console.log("Requesting location permission...");
//   const { status } = await Location.requestForegroundPermissionsAsync();

//   if (status !== 'granted') {
//     console.error('Permission to access location was denied');
//     return null;
//   }

//   console.log("Fetching GPS coordinates...");
//   const location = await Location.getCurrentPositionAsync({});
//   console.log("User Location:", location.coords);

//   return {
//     latitude: location.coords.latitude,
//     longitude: location.coords.longitude,
//   };
// };


export const getUserLocation = async () => {
  console.log("Requesting location permission...");
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.warn("Permission denied! Using default U.S. location.");
    return { latitude: 40.7128, longitude: -74.0060 }; // New York City as default
  }

  console.log("Fetching GPS coordinates...");
  const location = await Location.getCurrentPositionAsync({});
  console.log("User Location:", location.coords);

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};
