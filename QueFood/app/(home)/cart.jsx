import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCarts, getRestaurantName } from '../HelperFunctions/cartUtil';
import { router } from 'expo-router';


const Cart = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const userPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
        if (!userPhoneNumber) {
          console.error("User phone number not found. Redirect to login.");
          return;
        }

        const cartsData = await getAllCarts(userPhoneNumber);
        if (!cartsData) {
          console.error("No carts data found.");
          setCarts([]);
          return;
        }

        if (cartsData && Array.isArray(cartsData)) { // Check if cartsData is an array
          const cartsWithRestaurantNames = await Promise.all(
            cartsData.map(async (cart) => {
              const restaurantName = await getRestaurantName(cart.restaurant_id);
              return { ...cart, restaurant_name: restaurantName };
            })
          );

          if (cartsWithRestaurantNames) {
            const filteredCarts = cartsWithRestaurantNames.filter(
              (cart) => cart.fooditems && cart.fooditems.length > 0
            );
            setCarts(filteredCarts);
            console.log("Fetched carts:", filteredCarts);
          }
        } else {
          console.log("cartsData is not an array:", cartsData);
          setCarts([]);
        }
      } catch (error) {
        console.error("Failed to fetch carts:", error);
        setCarts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const renderCartItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/menu", params: { id: item.restaurant_id, name: item.restaurant_name } })}
      className="bg-white mx-4 mb-4 rounded-lg overflow-hidden shadow-lg"
    >
      <View className="flex-row items-center py-4 border-b border-gray-300">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{item.restaurant_name}</Text>
          {item.fooditems.map((foodItem, index) => (
            <View key={index} className="mt-2">
              <Text className="text-lg font-semibold">{foodItem.food_name}</Text>
              <Text className="text-gray-500">{foodItem.food_description || "No description"}</Text>
              <Text className="text-black font-bold mt-1">${foodItem.unit_price.toFixed(2)}</Text>
              <Text className="text-gray-500">Quantity: {foodItem.quantity}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold">Shopping Carts</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      ) : carts.length > 0 ? (
        <FlatList
          data={carts}
          keyExtractor={(item, index) => `${item.order_number}-${index}`}
          renderItem={renderCartItem}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons
            name="cart-outline"
            size={64}
            color="#aaa"
            style={{ marginBottom: 10 }}
          />
          <Text className="text-lg font-semibold mb-2">No carts available</Text>
          <Text className="text-center text-gray-500 mb-4">
            Once you add items from a restaurant or store, your carts will appear here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;