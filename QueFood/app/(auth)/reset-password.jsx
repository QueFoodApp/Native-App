import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { router } from 'expo-router';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import LoginSection from '../../components/LoginSection';
import BackButton from '../../components/BackButton';

const ResetPassword = () => {
  const [form, setForm] = useState({
    countryCode: "+1",
    phone: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">

      <BackButton />
      
      {/* Title */}
      <Text className="font-bold text-4xl font-bold text-black px-5 pt-[50]">Reset{'\n'}Password</Text>

      <Text className="font-sfpro text-xs text-gray-600 px-5 pt-3">Reset password via phone number</Text>

      {/* Phone Number Input */}
    <View className="px-5 mb-5">
        <PhoneNumberInput form={form} setForm={setForm} />
    </View>

      {/* Continue Button */}
      <LoginSection title="Continue" onLoginPress={() => router.push('/phone-verification?origin=resetPassword')} />
    </SafeAreaView>
  );
};

export default ResetPassword;
