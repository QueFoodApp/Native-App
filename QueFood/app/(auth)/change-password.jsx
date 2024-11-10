import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import LoginSection from '../../components/LoginSection';
import EyeIcon from '../../assets/images/eye.svg'; // Ensure the path to the icon is correct
import BackButton from '../../components/BackButton';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">

      <BackButton />
      {/* Title */}
      <Text className="font-bold text-4xl font-bold text-black px-5 pt-[50]">Reset{'\n'}Password</Text>

      {/* New Password Input */}
      <View className="px-5 mt-6 mb-4 relative">
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          placeholder="New Password"
          className="border-b border-gray-400 text-gray-800 px-2 py-2 font-sfpro text-base"
        />
        <TouchableOpacity
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={{ position: 'absolute', right: 20, bottom: 8 }}
        >
          <EyeIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Confirm New Password Input */}
      <View className="px-5 mb-8 relative">
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          placeholder="Confirm New Password"
          className="border-b border-gray-400 text-gray-800 px-2 py-2 font-sfpro text-base"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{ position: 'absolute', right: 20, bottom: 8 }}
        >
          <EyeIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <LoginSection title="Continue" onLoginPress={() => console.log("Password Changed")} />
    </SafeAreaView>
  );
};

export default ChangePassword;
