import React from "react";
import { SafeAreaView, ScrollView, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const OrderDetails = () => {
    const params = useLocalSearchParams();
    const order = params.order ? JSON.parse(params.order) : null;

    if (!order) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-lg font-bold">Order not found</Text>
            </SafeAreaView>
        );
    }
    const getStoreImage = (restaurant_id) => {
        const images = {
          1: require("../../assets/images/Smoothies.png"),
          87: require("../../assets/images/Burger.png"),
        };
        return images[restaurant_id];
      };
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header Image */}
                <View className="relative">
                    <Image
                        source={getStoreImage(order.restaurant_id)}
                        style={{ width: "100%", height: 200, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                    {/* Customer Service Badge */}
                    <View className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gray-900">
                        <Text className="text-white font-medium">Customer Service</Text>
                    </View>
                </View>

                {/* Order Details */}
                <View className="p-4">
                    <Text className="text-2xl font-bold">{order.restaurant_name}</Text>
                    <Text className="text-gray-500">{order.street_address || "No address provided"}</Text>
                    <View className="flex-row justify-between items-center mt-3">
                        <Text className="text-gray-700 font-medium">
                            Order #{order.order_number}
                        </Text>
                        <View className="flex-row items-center">
                            <Ionicons name="radio-button-on-outline" size={16} color="gray" />
                            <Text className="text-gray-700 ml-1 capitalize">{order.status}</Text>
                        </View>
                    </View>
                    <Text className="text-gray-500 mt-1">
                        Pickup Time: {order.pickup_time || "Pending"}
                    </Text>

                    {/* Order Items */}
                    <Text className="text-xl font-semibold mt-5">Your Items</Text>
                    {order.fooditems.map((item, index) => (
                        <View key={index} className="flex-row justify-between items-center mt-2">
                            <Text className="text-gray-700">
                                {item.quantity} x {item.food_name}
                            </Text>
                            <Text className="text-gray-700">
                                ${item.food_price ? (item.food_price * item.quantity).toFixed(2) : "N/A"}
                            </Text>
                        </View>
                    ))}

                    {/* Order Pricing Summary */}
                    <View className="mt-5 border-t border-gray-300 pt-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-700">Subtotal</Text>
                            <Text className="text-gray-700">${order.subtotal.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-700">Tax</Text>
                            <Text className="text-gray-700">${order.taxes.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-700">Service Fee</Text>
                            <Text className="text-gray-700">$0.99</Text>
                        </View>
                        <View className="flex-row justify-between mt-2 border-t border-gray-300 pt-3">
                            <Text className="text-xl font-semibold">Total</Text>
                            <Text className="text-xl font-semibold">${order.total.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Payment Method */}
                    <View className="mt-5">
                        <Text className="text-xl font-semibold">Payment</Text>
                        <View className="flex-row items-center mt-2">
                            <Ionicons name="card-outline" size={18} color="black" />
                            <Text className="text-gray-700 ml-2">{order.payment_method || "Apple Pay"}</Text>
                        </View>
                    </View>

                    {/* Order Time */}
                    <View className="mt-5">
                        <Text className="text-xl font-semibold">Order time</Text>
                        <Text className="text-gray-700 mt-1">
                            {new Date(order.order_time).toLocaleString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderDetails;
