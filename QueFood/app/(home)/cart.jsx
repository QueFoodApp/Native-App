import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Cart = () => {


  return (
    <SafeAreaView className="flex-1 bg-white">
     
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold">Shopping Cart</Text>
      </View>

    
      <View className="flex-1 justify-center items-center px-8">

        <Ionicons
          name="cart-outline"
          size={64}
          color="#aaa"
          style={{ marginBottom: 10 }}
        />


        <Text className="text-lg font-semibold mb-2">Add items to start a cart</Text>


        <Text className="text-center text-gray-500 mb-4">
          Once you add items from a restaurant or store, your cart will appear here.
        </Text>

      </View>
    </SafeAreaView>
  );
};

export default Cart;
