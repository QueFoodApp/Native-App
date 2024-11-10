import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { router } from 'expo-router';
import BackgroundShapes from '../../components/Background';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import PasswordInput from '../../components/PasswordInput';
import ForgotPasswordLink from '../../components/ForgetPassword';
import LoginSection from '../../components/LoginSection';
import SocialLogin from '../../components/SocialLogin';

const SignIn = () => {
  const [form, setForm] = useState({
    countryCode: "+1",
    phone: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const validatePassword = () => {
    if (form.password !== "expectedPassword") {
      setPasswordError("Incorrect Password");
    } else {
      setPasswordError("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background Shapes */}
      <BackgroundShapes />
      
      {/* Phone Number Input */}
      <PhoneNumberInput form={form} setForm={setForm} />

      {/* Password Input with Error */}
      <PasswordInput form={form} setForm={setForm} error={passwordError} />

      {/* Forgot Password Link */}
      <ForgotPasswordLink onPress={() => router.push('/reset-password')} />
 
      {/* Inline Log In Text and Button */}
      <LoginSection title="Log In" onLoginPress={() => console.log("Login Pressed")} />

      {/* Social Login Section */}
      <SocialLogin
        onGooglePress={() => console.log("Google login pressed")}
        onFacebookPress={() => console.log("Facebook login pressed")}
        onApplePress={() => console.log("Apple login pressed")}
      />

      {/* Sign Up Link */}
      <View className="items-center mt-4">
        <Text className="text-gray-500 text-sm font-sfpro">
          Don’t have an account?{' '}
          <Text
            onPress={() => router.push('/sign-up')} // Navigate to SignUp page
            className="text-red-500 font-semibold"
          >
            Sign Up
          </Text>
        </Text>
      </View>



    </SafeAreaView>
  );
};

export default SignIn;
