import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchNearbyRestaurants } from "../HelperFunctions/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Import router for navigation
import BottomBar from "../../components/BottomBar";
import LocationTopBar from "../../components/TopBar"; // Ensure correct import
import { getRandomFoodImage } from "../HelperFunctions/imageUtils";
import { useRouter } from "expo-router"; 

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ location: "" });
  const [error, setError] = useState(false);

  // Fetch restaurants when the component loads
  useEffect(() => {
    const loadRestaurants = async () => {
      if (!form.location) {
        setRestaurants([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      let data = await fetchNearbyRestaurants(form.location);

      // Assign a unique image to each restaurant using its ID
      data = data.map((restaurant) => ({
        ...restaurant,
        image: getRandomFoodImage(restaurant.restaurant_id), // Uses restaurant ID for uniqueness
      }));

      setRestaurants(data);
      setLoading(false);
    };

    loadRestaurants();
  }, [form.location]);

  const getRandomRestaurants = (restaurants) => {
    if (restaurants.length <= 4) return restaurants; // If 4 or fewer, use all
    return restaurants.sort(() => 0.5 - Math.random()).slice(0, 4); // Shuffle and pick 4
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Pass navigation function to profile button */}
      <LocationTopBar 
        form={form}
        setForm={setForm}
        error={error}
        onProfilePress={() => router.push('/profile')} 
      />

      {/* 🔥 Banner Section */}
      <View className="h-48 bg-black mx-4 rounded-lg overflow-hidden justify-center items-center mb-4">
        {/* Background Image */}
        <Image 
          source={{ uri: "https://source.unsplash.com/600x300/?coffee" }} 
          className="absolute w-full h-full opacity-40"
        />
        <Text className="text-white text-xl font-semibold">Relax with a cup of coffee</Text>
        <Text className="text-white text-sm mb-2">Buy one, get one free</Text>
        <TouchableOpacity className="bg-white px-5 py-2 rounded-full mt-2">
          <Text className="text-black font-bold">View Restaurants</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-4">Fetching restaurants...</Text>
        </View>
      ) : restaurants.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="paper-plane-outline" size={64} color="#aaa" style={{ marginBottom: 10 }} />
          <Text className="text-xl font-semibold mb-2">No restaurants nearby</Text>
          <Text className="text-center text-gray-500 mb-4">
            We couldn’t find any restaurants near your location.
          </Text>
        </View>
      ) : (
        <FlatList
            data={restaurants}
            keyExtractor={(item) => item.restaurant_id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity 
                onPress={() => router.push({ pathname: "/menu", params: { id: item.restaurant_id, name: item.restaurant_name } })}
                className="bg-white mx-4 mb-4 rounded-lg overflow-hidden shadow-lg"
                >
                {/* 🖼️ Restaurant Image */}
                <Image 
                    source={{ uri: item.image }} 
                    className="w-full h-48 bg-gray-200"
                />

                {/* 📋 Restaurant Info */}
                <View className="p-4">
                    <Text className="text-lg font-bold">{item.restaurant_name}</Text>
                    <Text className="text-gray-500">{item.address.street_address}, {item.address.city}</Text>

                    {/* ⭐ Rating | 💰 Price */}
                    <View className="flex-row items-center mt-2">
                    <Text className="text-gray-500">⭐ {item.ratings}</Text>
                    <Text className="text-gray-500 ml-2">💰 {item.pricing_levels}</Text>
                    </View>

                    {/* 📏 Distance */}
                    <Text className="text-gray-400 mt-1">{item.distance_km} km away</Text>
                </View>
                </TouchableOpacity>
            )}
            />
      )}

      {/* Bottom Navigation Bar */}
    </SafeAreaView>
  );
};

export default Home;
