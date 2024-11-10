import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { router } from 'expo-router';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import LoginSection from '../../components/LoginSection';
import SocialLogin from '../../components/SocialLogin';
import BackButton from '../../components/BackButton';

const SignUp = () => {
  const [form, setForm] = useState({
    countryCode: "+1",
    phone: "",
  });
  return (
    <SafeAreaView className="flex-1 bg-white">

      <BackButton />
      
      {/* Title*/}
      <Text className="font-bold text-4xl font-bold text-black px-5 pt-[50]">Create{'\n'}Account</Text>
      
      {/* Phone Number Input */}
      <PhoneNumberInput form={form} setForm={setForm} />
 
      {/* Inline Log In Text and Button */}
      <LoginSection title="Continue" onLoginPress={() => router.push({ pathname: '/phone-verification', params: { origin: 'SignUp' } })}
 />

      {/* Social Login Section */}
      <SocialLogin
        onGooglePress={() => console.log("Google login pressed")}
        onFacebookPress={() => console.log("Facebook login pressed")}
        onApplePress={() => console.log("Apple login pressed")}
      />

    </SafeAreaView>
  );
};

export default SignUp;
