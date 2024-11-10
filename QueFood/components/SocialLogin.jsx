import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GoogleLogo from '../assets/images/GoogleLogo.svg'; // Adjust the path as needed
import FacebookLogo from '../assets/images/FacebookLogo.svg';
import AppleLogo from '../assets/images/AppleLogo.svg';

const SocialLogin = ({ onGooglePress, onFacebookPress, onApplePress }) => {
  return (
    <View className="items-center mt-8 px-6">
      {/* Divider with OR */}
      <View className="flex-row items-center mb-4 w-full">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-gray-500 text-base font-sfpro">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Log In with Text */}
      <Text className="text-gray-600 font-semibold mb-4 font-sfpro text-base">Log In with</Text>

      {/* Social Media Icons */}
      <View className="flex-row mb-6">
        <TouchableOpacity onPress={onApplePress} className="w-10 h-10 bg-black rounded-full items-center justify-center px-2 mx-2">
          <AppleLogo width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onFacebookPress} className="w-10 h-10 bg-black rounded-full items-center justify-center px-2 mx-8">
          <FacebookLogo width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onGooglePress} className="w-10 h-10 bg-black rounded-full items-center justify-center px-2 mx-2">
          <GoogleLogo width={24} height={24} />
        </TouchableOpacity>
      </View>

     
    </View>
  );
};

export default SocialLogin;
