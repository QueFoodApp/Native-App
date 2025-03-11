// import React, { useState, useEffect } from "react";
// import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
// import { useStripe } from "@stripe/stripe-react-native";
// import { useLocalSearchParams } from "expo-router"; // ✅ Get total from navigation params
// import API_BASE_URL from "../../config";

// export default function PaymentScreen() {
//   const { total } = useLocalSearchParams(); // ✅ Read total price from checkout
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const [loading, setLoading] = useState(false);

//   // Step 1: Fetch PaymentIntent client_secret from the server
//   const fetchPaymentIntentClientSecret = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: Math.round(parseFloat(total) * 100) }), // Convert to cents
//       });

//       const data = await response.json();
//       if (!data.client_secret) {
//         throw new Error("No client_secret found in response");
//       }

//       return data.client_secret;
//     } catch (err) {
//       console.error("❌ Error fetching client secret:", err);
//       Alert.alert("Error", err.message);
//       return null;
//     }
//   };

//   // Step 2: Initialize and present the Payment Sheet
//   const handlePayPress = async () => {
//     setLoading(true);

//     const clientSecret = await fetchPaymentIntentClientSecret();
//     if (!clientSecret) {
//       setLoading(false);
//       return;
//     }

//     const { error: initError } = await initPaymentSheet({
//       paymentIntentClientSecret: clientSecret,
//       merchantDisplayName: "Que Food Hall",
//       allowsDelayedPaymentMethods: true,
//     });

//     if (initError) {
//       setLoading(false);
//       console.error("❌ initPaymentSheet Error:", initError);
//       Alert.alert("Error", initError.message);
//       return;
//     }

//     const { error: paymentSheetError } = await presentPaymentSheet();
//     setLoading(false);

//     if (paymentSheetError) {
//       console.error("❌ Payment Sheet Error:", paymentSheetError);
//       Alert.alert("Payment Failed", paymentSheetError.message);
//     } else {
//       Alert.alert("✅ Success", "Your payment was successful!");
//     }
//   };

//   return (
//     <View>
//     </View>
//   );
// }
