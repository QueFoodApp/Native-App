import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderHistory = () => {
  const handleShoppingPress = () => {
    console.log("Shopping button pressed");
    // not sure what to do here? maybe navigate to home or fav restaurant    
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      <View className="px-4 py-3">
        <Text className="text-2xl font-bold">Order History</Text>
      </View>


      <View className="flex-1 justify-center items-center px-8">
    
        <Ionicons
          name="bag-handle-outline"
          size={64}
          color="#aaa"
          style={{ marginBottom: 10 }}
        />


        <Text className="text-xl font-semibold mb-2">No order history yet</Text>


        <Text className="text-center text-gray-500 mb-4">
          Try with one of our awesome restaurants and place your first order.
        </Text>


        <TouchableOpacity
          className="bg-black px-5 py-3 rounded-full"
          onPress={handleShoppingPress}
        >
          <Text className="text-white font-medium">Shopping</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default OrderHistory;
