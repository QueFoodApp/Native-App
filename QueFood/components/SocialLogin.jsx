import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router"; // ✅ Ensure Navigation Works
import AppleLogo from "../assets/images/AppleLogo.svg";
import FacebookLogo from "../assets/images/FacebookLogo.svg";
import GoogleLogo from "../assets/images/GoogleLogo.svg";
import API_BASE_URL from "../config";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = "223931378619-aof6318jf563gokm2qutshb3m4pkitc6.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "com.googleusercontent.apps.223931378619-aof6318jf563gokm2qutshb3m4pkitc6:/oauthredirect";

const SocialLogin = ({ onFacebookPress }) => {
  // ✅ Google Authentication
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: GOOGLE_REDIRECT_URI,
  });

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn(response.authentication?.accessToken);
    } else if (response?.type === "error") {
      Alert.alert("❌ Google Sign-In Failed", "Something went wrong.");
    }
  }, [response]);

  const handleGoogleSignIn = async (accessToken) => {
    try {
      // ✅ Fetch user info from Google API
      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await userInfoResponse.json();

      // ✅ Send Google Data to Backend to Get JWT Token
      const backendResponse = await fetch(`${API_BASE_URL}/api/auth/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
        }),
      });

      if (!backendResponse.ok) {
        const backendError = await backendResponse.json();
        Alert.alert("❌ Backend Error", backendError.detail || "Google authentication failed");
        return;
      }

      const backendData = await backendResponse.json();

      // ✅ Handle case where phone number is required
      if (backendData.require_phone_number) {
        Alert.alert("📌 Phone number required", "Redirecting to Link Phone...");
        router.push(`/link-phone?email=${userInfo.email}`);
        return;
      }

      // ✅ Store JWT Token (From Backend)
      await AsyncStorage.setItem("token", backendData.access_token);

      // ✅ Ensure Navigation Happens
      router.push("/home");
    } catch (error) {
      Alert.alert("❌ Google Sign-In Error", error.message);
    }
  };

  // ✅ Apple Authentication Handler
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // ✅ Fetch Apple User Info
      const appleUserInfo = {
        apple_id: credential.user,
        email: credential.email || "No Email Provided",
        full_name:
          credential.fullName?.givenName && credential.fullName?.familyName
            ? `${credential.fullName.givenName} ${credential.fullName.familyName}`
            : "No Name Provided",
      };

      // ✅ Send Apple Data to Backend to Get JWT Token
      const backendResponse = await fetch(`${API_BASE_URL}/api/auth/apple-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appleUserInfo),
      });

      if (!backendResponse.ok) {
        const backendError = await backendResponse.json();
        Alert.alert("❌ Backend Error", backendError.detail || "Apple authentication failed");
        return;
      }

      const backendData = await backendResponse.json();

      // ✅ Handle case where phone number is required
      if (backendData.require_phone_number) {
        Alert.alert("📌 Phone number required", "Redirecting to Link Phone...");
        router.push(`/link-phone?email=${appleUserInfo.email}`);
        return;
      }

      // ✅ Store JWT Token (From Backend)
      await AsyncStorage.setItem("token", backendData.access_token);

      // ✅ Ensure Navigation Happens
      router.push("/home");
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        Alert.alert("❌ Apple Sign-In Cancelled");
      } else {
        Alert.alert("❌ Apple Sign-In Error", error.message);
      }
    }
  };

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
        <TouchableOpacity onPress={handleAppleSignIn} className="w-10 h-10 bg-black rounded-full items-center justify-center px-2 mx-2">
          <GoogleLogo width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => promptAsync()} // ✅ Trigger Google Login
          disabled={!request}
          className="w-10 h-10 bg-black rounded-full items-center justify-center px-2 mx-2"
        >
          <AppleLogo width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialLogin;
