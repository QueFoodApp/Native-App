import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Vector1 from "../assets/images/vector1.svg"; // Black shape
import Vector2 from "../assets/images/vector2.svg"; // Red shape
import Eclipse1 from "../assets/images/eclipse1.svg"; // blue shape

export default function Onboarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Container to hold the overlapping SVGs */}
      {/* Render Blue Shape - Eclipse1 */}
      <Eclipse1 
          width={250} 
          height={200} 
          style={{ position: 'absolute', top: 140, right: -50 }} 
        />
      <View style={{ position: 'relative', width: '100%', height: 300 }}>
        {/* Render Black Shape - Vector1 */}
        <Vector1 
          width="150%" 
          height="350" 
          style={{ position: 'absolute', top: -70, left: -100 }} 
        />
        {/* Render Red Shape - Vector2 */}
        <Vector2 
          width="110%" 
          height="200" 
          style={{ position: 'absolute', top: -70, left: -70 }} 
        />
        {/* Text Overlay */}
        <View style={{ position: 'absolute', top: 120, left: 30 }}>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>QUE</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>FOODHALL</Text>
        </View>

        {/* Introductory Text and Continue Button */}
      <View style={{ flex: 1, top: 350, paddingHorizontal: 20, justifyContent: 'center' }}>
        {/* Introductory Text */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Welcome to QUE Foodhall!
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 40 }}>
          The best way to enjoy your food experience. Continue to start ordering.
        </Text>

        {/* Continue with Phone Number Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FF7D76',
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={() => {
            //Go to Auth screen
            
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Continue with Phone Number</Text>
        </TouchableOpacity>
      </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
