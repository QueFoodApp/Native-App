// PaymentScreen.jsx
import React, { useState } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import API_BASE_URL from '../../config'; 

export default function PaymentScreen() {
  // Grab Stripe helper functions
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Loading state for your UI
  const [loading, setLoading] = useState(false);

  // Step 1: Fetch PaymentIntent client_secret from the server
  const fetchPaymentIntentClientSecret = async () => {
    try {
      // Make a POST request to your FastAPI endpoint
      const response = await fetch(`${API_BASE_URL}/api/payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NO body needed; do NOT send client_secret up.
      });

      const data = await response.json();
      // Check that the server returned a valid client_secret
      if (!data.client_secret) {
        throw new Error("No client_secret found in response");
      }

      return data.client_secret;
    } catch (err) {
      console.error("Error fetching client secret:", err);
      Alert.alert("Error", err.message);
      return null;
    }
  };

  // Step 2: Initialize and present the Payment Sheet
  const handlePayPress = async () => {
    setLoading(true);

    // 1) Fetch the client_secret from the server
    const clientSecret = await fetchPaymentIntentClientSecret();
    if (!clientSecret) {
      setLoading(false);
      return;
    }

    // 2) Initialize the Payment Sheet
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Que Food Hall", // shown on the Payment Sheet
      allowsDelayedPaymentMethods: true,    // optional
    });

    if (initError) {
      setLoading(false);
      console.error("initPaymentSheet Error:", initError);
      Alert.alert("Error", initError.message);
      return;
    }

    // 3) Present the Payment Sheet
    const { error: paymentSheetError } = await presentPaymentSheet();
    setLoading(false);

    if (paymentSheetError) {
      console.error("Payment Sheet Error:", paymentSheetError);
      Alert.alert("Payment Failed", paymentSheetError.message);
    } else {
      Alert.alert("Success", "Your payment was successful!");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>
        Stripe Payment Example
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Pay $0.50" onPress={handlePayPress} />
      )}
    </View>
  );
}
