import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BottomBar from '../../components/BottomBar';
import TopBar from '../../components/TopBar';


//component to show "No Restaurants Nearby" layout
const NoRestaurantsNearby = ({ onChangeLocation }) => (
  <View className="flex-1 justify-center items-center px-8">

    <Ionicons name="paper-plane-outline" size={64} color="#aaa" style={{ marginBottom: 10 }} />

    <Text className="text-xl font-semibold mb-2">No restaurants nearby</Text>

    <Text className="text-center text-gray-500 mb-4">
      We couldn’t find any restaurants near your location.
      Follow along as we launch new cities.
    </Text>

    <TouchableOpacity
        className="bg-black px-5 py-3 rounded-full"
        onPress={onChangeLocation}
      >
        <Text className="text-white font-medium">Change Location</Text>
      </TouchableOpacity>
  </View>
);
 
const Home = () => {

  const [form, setForm] = useState({ location: '' });

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(true);

  const [restaurants, setRestaurants] = useState([]);


  const fetchRestaurants = async () => {
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);


  const handleProfilePress = () => {
    console.log("Profile pressed");
    router.push("/profile")
  };

  const handleChangeLocation = () => {
    console.log("Change Location pressed");
    
  };

  // If loading, show a spinner
  if (!loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4">Fetching restaurants...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">

      <TopBar
        form={form}
        setForm={setForm}
        error={error}
        onProfilePress={handleProfilePress}
      />

      {/* show NoRestaurantsNearby or fetched places */}
      {restaurants.length === 0 ? (
        <NoRestaurantsNearby onChangeLocation={handleChangeLocation} />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold mb-4">Welcome to the Home Page!</Text>
          <Text className="text-lg mb-8">You have successfully signed in.</Text>
          <Button title="Logout" onPress={handleLogout} />
          
          <View className="mt-10">
            <Text className="mt-2">Error is {error ? 'ON' : 'OFF'}</Text>
            <Text className="mt-2">Found {restaurants.length} restaurants</Text>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
};

export default Home;

// const Home = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadRestaurants = async () => {
//       setLoading(true);
//       const data = await fetchNearbyRestaurants();
//       setRestaurants(data);
//       setLoading(false);
//     };

//     loadRestaurants();
//   }, []);

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* <TopBar /> */}

//       {loading ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#000" />
//           <Text className="mt-4">Fetching nearby restaurants...</Text>
//         </View>
//       ) : restaurants.length === 0 ? (
//         <View className="flex-1 justify-center items-center">
//           <Text className="text-xl font-semibold">No restaurants nearby</Text>
//           <Text className="text-center text-gray-500">We couldn’t find any restaurants near you.</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={restaurants}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View className="p-4 border-b border-gray-300">
//               <Text className="text-lg font-bold">{item.name}</Text>
//               <Text className="text-gray-500">{item.address}</Text>
//             </View>
//           )}
//         />
//       )}

//       <BottomBar />
//     </SafeAreaView>
//   );
// };

// export default Home;