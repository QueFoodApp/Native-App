import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { fetchMenuByRestaurantId } from "../HelperFunctions/api";
import { getRandomFoodImage } from "../HelperFunctions/imageUtils";
import { Ionicons } from "@expo/vector-icons"; // For back button
import { Dimensions } from "react-native"; 

const screenHeight = Dimensions.get("window").height;

const Menu = () => {
  const { id, name } = useLocalSearchParams(); 
  const navigation = useNavigation(); // For handling navigation
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const restaurantImage = getRandomFoodImage(id); 

  // Hide default header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      const data = await fetchMenuByRestaurantId(id);
      setMenuItems(data);
      setLoading(false);
    };

    loadMenu();
  }, [id]);

  // Group menu items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 🔥 Restaurant Header Section */}
      <View className="h-56 relative">
        {/* Background Image */}
        <Image 
          source={{ uri: restaurantImage }} 
          className="absolute w-full h-full"
          style={{ resizeMode: "cover" }}
        />

        {/* Overlay for readability */}
        <View className="absolute w-full h-full bg-black opacity-20" />

        {/* 🔥 Custom Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="absolute top-12 left-4 bg-white p-2 rounded-full shadow-lg"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Restaurant Details */}
        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-white text-2xl font-bold">{name}</Text>

          {/* Action Buttons */}
          <View className="flex-row mt-3">
            <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-3 shadow-lg">
              <Text className="text-black font-semibold">Right Now</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full shadow-lg">
              <Text className="text-gray-600 font-semibold">Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={Object.entries(groupedMenu)}
          keyExtractor={(item, index) => `${item[0]}-${index}`}
          renderItem={({ item }) => (
            <View className="mt-6 px-4">
              {/* Category Header */}
              <Text className="text-xl font-semibold mb-2">{item[0]}</Text>
              {item[1].map((foodItem, foodIndex) => (
                <TouchableOpacity
                  key={`${foodItem.menu_id}-${foodIndex}`} 
                  disabled={foodItem.availability !== "available"}
                  className="flex-row items-center py-4 border-b border-gray-300"
                  style={{
                    opacity: foodItem.availability === "available" ? 1 : 0.5,
                  }}
                >
                  {/* Image */}
                  {foodItem.image_url && (
                    <Image
                      source={{ uri: foodItem.image_url }}
                      className="w-24 h-24 rounded-lg mr-4"
                      style={{ resizeMode: "cover" }}
                    />
                  )}

                  {/* Food Details */}
                  <View className="flex-1">
                    <Text className="text-lg font-semibold">{foodItem.food_name}</Text>
                    <Text className="text-gray-500">{foodItem.food_description}</Text>
                    <Text className="text-black font-bold mt-1">${foodItem.food_price.toFixed(2)}</Text>

                    {/* Show "Not Available" if item is unavailable */}
                    {foodItem.availability !== "available" && (
                      <Text className="text-red-500 font-semibold mt-1">Not available to order</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Menu;
