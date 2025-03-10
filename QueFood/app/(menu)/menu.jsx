import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMenuByRestaurantId } from "../HelperFunctions/api";
import { getRandomFoodImage } from "../HelperFunctions/imageUtils";
import { createOrGetCart, addItemToCart, getCart, getCartByCustomerAndRestaurant } from "../HelperFunctions/cartUtil";

const Menu = () => {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);

  const restaurantImage = getRandomFoodImage(id);

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

  useEffect(() => {
    const setupCart = async () => {
      try {
        const restaurantId = parseInt(id, 10);
        const userPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
        if (!userPhoneNumber) {
          console.error("User phone number not found. Redirect to login.");
          return;
        }
        setUserPhoneNumber(userPhoneNumber);

        let existingCart;
        try {
          existingCart = await getCart(userPhoneNumber, restaurantId);
        } catch (error) {
          if (error.message.includes("Cart not found")) {
            console.log("No existing cart found, creating a new one.");
          } else {
            throw error;
          }
        }

        if (existingCart && existingCart.restaurant_id === restaurantId) {
          setCart(existingCart);
        } else {
          const newCart = await createOrGetCart(userPhoneNumber, restaurantId);
          setCart(newCart);
        }
      } catch (error) {
        console.error("Failed to setup cart:", error);
      }
    };
    setupCart();
  }, [id]);

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleAddToCart = async (foodItem) => {
    if (!cart) return;
    try {
      const updatedCart = await addItemToCart(cart.order_number, foodItem);
      setCart(prevCart => ({...prevCart, ...updatedCart}));
    } catch (error) {
      console.error("Add to cart error:", error.message);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items_count === 0) {
      console.log("Cart is empty.");
      return;
    }
    console.log("Checkout cart:", cart);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-56 relative">
        <Image
          source={{ uri: restaurantImage }}
          className="absolute w-full h-full"
          style={{ resizeMode: "cover" }}
        />
        <View className="absolute w-full h-full bg-black opacity-20" />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-4 bg-white p-2 rounded-full shadow-lg"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-white text-2xl font-bold">{name}</Text>
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
          renderItem={({ item }) => {
            const [categoryName, items] = item;
            return (
              <View className="mt-6 px-4">
                <Text className="text-xl font-semibold mb-2">{categoryName}</Text>
                {items.map((foodItem, idx) => (
                  <View
                    key={`${foodItem.menu_id}-${idx}`}
                    className="flex-row items-center py-4 border-b border-gray-300"
                    style={{ opacity: foodItem.availability === "available" ? 1 : 0.5 }}
                  >
                    {foodItem.image_url && (
                      <Image
                        source={{ uri: foodItem.image_url }}
                        className="w-24 h-24 rounded-lg mr-4"
                        style={{ resizeMode: "cover" }}
                      />
                    )}

                    <View className="flex-1">
                      <Text className="text-lg font-semibold">{foodItem.food_name}</Text>
                      <Text className="text-gray-500">{foodItem.food_description || "No description"}</Text>
                      <Text className="text-black font-bold mt-1">
                        ${foodItem.food_price.toFixed(2)}
                      </Text>

                      {foodItem.availability !== "available" && (
                        <Text className="text-red-500 font-semibold mt-1">
                          Not available to order
                        </Text>
                      )}
                    </View>

                    {foodItem.availability === "available" && (
                      <TouchableOpacity
                        onPress={() => handleAddToCart(foodItem)}
                        className="bg-blue-500 px-3 py-2 rounded-md"
                      >
                        <Text className="text-white font-semibold">Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}

      {cart && cart.items_count > 0 && (
        <View className="absolute bottom-0 left-0 w-full px-4 pb-6">
          <TouchableOpacity
            onPress={handleCheckout}
            activeOpacity={0.8}
            className="bg-black flex-row items-center justify-between rounded-full px-6 py-4 shadow-lg"
          >
            <Text className="text-white font-semibold">
              {cart.items_count} {cart.items_count === 1 ? "item" : "items"}
            </Text>
            <Text className="text-white font-semibold">Checkout</Text>
            <Text className="text-white font-semibold">
              ${cart.subtotal.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Menu;