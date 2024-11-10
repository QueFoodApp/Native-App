import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import LoginSection from '../../components/LoginSection';
import BackButton from '../../components/BackButton';

const PhoneVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // For a 6-digit verification code
  const phoneNumber = "+1 (647) 221-0976"; // Replace with actual phone number passed as prop or state

  const { origin } = useLocalSearchParams(); // Retrieve `origin` from the query parameters
  console.log("Origin:", origin);


  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Automatically focus on the next input if available
    if (text && index < code.length - 1) {
      const nextInput = `codeInput${index + 1}`;
      this[nextInput].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      // Clear the previous field and move focus to it
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      const previousInput = `codeInput${index - 1}`;
      this[previousInput].focus();
    }
  };

  const handleResend = () => {
    console.log("Resend code pressed");
    // Handle resend logic here
  };

  const handleConfirm = () => {
    // Conditional navigation based on `origin`
    if (origin === 'resetPassword') {
      router.push('/change-password'); // Example for Reset Password
    } else if (origin === 'SignUp') {
      router.push('/profile-information'); // Example for Sign Up
    } else {
      console.log("Unknown origin:", origin);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      <BackButton />
      
      {/* Title */}
      <Text className="font-bold text-4xl font-bold text-black px-5 pt-[50]">
        Phone{'\n'}Verification
      </Text>

      <Text className="font-sfpro text-xs text-gray-600 mb-8 px-5 pt-3">Phone Number {phoneNumber}</Text>

      {/* Code Input Fields */}
      <View className="flex-row justify-between mb-6 px-3 py-2">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(input) => { this[`codeInput${index}`] = input }}
            className="font-sfpro border-b border-gray-400 text-2xl text-center w-[50] px-2 py-2"
          />
        ))}
      </View>

      {/* Resend Link */}
      <View className="flex-row justify-left mb-8 px-4">
        <Text className="font-sfpro text-gray-600">Don’t receive code? </Text>
        <TouchableOpacity onPress={handleResend}>
          <Text className="font-sfpro text-black font-semibold underline">Resend</Text>
        </TouchableOpacity>
      </View>

      <LoginSection title="Confirm" onLoginPress={ handleConfirm } />
    </SafeAreaView>
  );
};

export default PhoneVerification;
