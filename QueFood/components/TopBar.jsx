import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LocationTopBar = ({ form, setForm, error, onProfilePress }) => {
  const labelColor = error ? "#FF0000" : "#6b7280";

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

        <Ionicons
          name="chevron-down-outline"
          size={20}
          color={labelColor}
          style={{ marginLeft: 4 }}
        />
      </View>

      <TouchableOpacity onPress={onProfilePress}>
        <Ionicons name="person-circle-outline" size={36} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default LocationTopBar;
