import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import LoginSection from '../../components/LoginSection';
import EyeIcon from '../../assets/images/eye.svg'; // Ensure the path is correct
import BackButton from '../../components/BackButton';

const ProfileInformation = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">

      <BackButton />
      {/* Title */}
      <Text className="font-bold text-4xl font-bold text-black px-5 pt-[50]">
        Profile{'\n'}Information
      </Text>

      {/* Email Input */}
      <View className="px-5 mt-6 mb-4">
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          className="border-b border-gray-400 text-gray-800 px-2 py-2 font-sfpro text-base"
        />
      </View>

      {/* Password Input */}
      <View className="px-5 mb-4">
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="Password"
          className="border-b border-gray-400 text-gray-800 px-2 py-2 font-sfpro text-base"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-7 bottom-4"
        >
          <EyeIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View className="px-5 mb-8">
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          placeholder="Confirm Password"
          className="border-b border-gray-400 text-gray-800 px-2 py-2 font-sfpro text-base"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-7 bottom-4"
        >
          <EyeIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <LoginSection title="Continue" onLoginPress={() => console.log("Profile Information Continued")} />
    </SafeAreaView>
  );
};

export default ProfileInformation;
