import React from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';

const LocationTopBar = ({ form = { location: "" }, setForm, error, onProfilePress}) => {

  const labelColor = error ? "#FF0000" : "#6b7280";

  const handleLocationPress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please enable location permissions in settings to use this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    try {
      let result = await Location.reverseGeocodeAsync(location.coords);
      console.log("Geocoding result:", result);
      if (result && result.length > 0) {
        const address = `${result[0].name}, ${result[0].city}, ${result[0].region}, ${result[0].country}`;
        setForm({ ...form, location: address });
      } else {
        Alert.alert('Address not found', 'Could not determine address for current location.');
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert('Geocoding Error', 'Failed to retrieve address from coordinates.');
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">

      <View
        className="flex-row items-center flex-1 mr-4 bg-gray-100 px-3 py-2 rounded-full"
        style={{
          borderColor: error ? "#FF0000" : "transparent",
          borderWidth: error ? 1 : 0,
        }}
      >

        <Ionicons name="location-outline" size={20} color={labelColor} />


        <TextInput
          value={form.location}
          onChangeText={(val) => setForm({ ...form, location: val })}
          placeholder="Enter Location"
          placeholderTextColor={labelColor}
          style={{
            flex: 1,
            marginLeft: 4,
            fontSize: 16,
            paddingVertical: 0,
            color: error ? "#FF0000" : "#000",
          }}
        />

        <TouchableOpacity onPress={handleLocationPress}>
          <Ionicons
            name="navigate-outline"
            size={20}
            color={labelColor}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onProfilePress}>
        <Ionicons name="person-circle-outline" size={36} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default LocationTopBar;
