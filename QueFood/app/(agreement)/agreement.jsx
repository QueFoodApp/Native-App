import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import icon library

const UserAgreement = () => {
  return (
    <>
      {/* ✅ Custom Back Button */}
      <Stack.Screen options={{ 
        title: 'User Agreement',  
        headerTintColor: 'black',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }} />

      {/* ✅ Ensure SafeAreaView is outside ScrollView */}
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"  // ✅ Fixes unresponsive scroll on touch
        >
          {/* Title */}
          <Text style={styles.title}>Terms &</Text>
          <Text style={styles.title}>Conditions</Text>

          {/* Content */}
          <Text style={styles.paragraph}>
            Welcome to The Que App. By accessing or using our services, you agree to be bound by 
            these Terms & Conditions. Please read them carefully before proceeding.
          </Text>

         {/* Section 1 - Use of Service */}
         <Text style={styles.subTitle}>1) Use of Service</Text>
          <Text style={styles.paragraph}>
            The Que App connects customers with restaurants for food delivery. You must be at least 
            18 years old or have legal parental consent to use our services. Misuse, fraudulent activity, 
            or any illegal actions will result in account termination.
          </Text>

          {/* Section 2 - Account Registration */}
          <Text style={styles.subTitle}>2) Account Registration</Text>
          <Text style={styles.paragraph}>
            To place an order, you must register an account with accurate and complete information. 
            You are responsible for maintaining the security of your account and must notify us 
            immediately at support@thequeapp.com if you suspect unauthorized access.
          </Text>

          {/* Section 3 - Payments & Refunds */}
          <Text style={styles.subTitle}>3) Payments & Refunds</Text>
          <Text style={styles.paragraph}>
            The Que App processes payments securely via third-party providers. By placing an order, 
            you authorize the charge to your selected payment method. Refunds are issued at the discretion 
            of The Que App based on circumstances such as missing or incorrect orders.
          </Text>

          {/* Section 4 - Order Cancellations */}
          <Text style={styles.subTitle}>4) Order Cancellations</Text>
          <Text style={styles.paragraph}>
            Orders may only be canceled within a limited time after placement. Once a restaurant has 
            started preparing your order, cancellations are not permitted. Contact our support team 
            at support@thequeapp.com for any cancellation requests.
          </Text>

          {/* Section 5 - Delivery & Liability */}
          <Text style={styles.subTitle}>5) Delivery & Liability</Text>
          <Text style={styles.paragraph}>
            Estimated delivery times are approximate and not guaranteed. The Que App is not responsible 
            for delays due to traffic, weather, or other unforeseen circumstances. If your order arrives 
            significantly late or with missing items, please contact support@thequeapp.com within 24 hours.
          </Text>

          {/* Section 6 - User Conduct */}
          <Text style={styles.subTitle}>6) User Conduct</Text>
          <Text style={styles.paragraph}>
            Users must treat restaurant staff and delivery partners with respect. Any harassment, 
            fraud, or violations of our policies may result in immediate account suspension.
          </Text>

          {/* Section 7 - Privacy Policy */}
          <Text style={styles.subTitle}>7) Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We value your privacy. Your personal information is collected and used in accordance with 
            our Privacy Policy. We do not sell user data to third parties. For more details, 
            visit our Privacy Policy page or email privacy@thequeapp.com.
          </Text>

          {/* Section 8 - Changes to Terms */}
          <Text style={styles.subTitle}>8) Changes to Terms</Text>
          <Text style={styles.paragraph}>
            The Que App reserves the right to update these Terms & Conditions at any time. Continued 
            use of our services constitutes acceptance of the revised terms.
          </Text>

          {/* Section 9 - Contact Us */}
          <Text style={styles.subTitle}>9) Contact Us</Text>
          <Text style={styles.paragraph}>
            For any questions regarding these Terms & Conditions, please contact us at support@thequeapp.com.
          </Text>

          {/* Add Extra Space to Ensure Scrolling */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// ✅ Updated Styles to Fix Scrolling
const styles = StyleSheet.create({
  container: {
    flex: 1,  // ✅ Use `flex: 1` to make sure it takes full screen
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,  // ✅ Ensures ScrollView is scrollable
    padding: 20,
  },
  customBackButton: {
    marginLeft: 10, // Adjusts back button position
    padding: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#333',
  },
});

export default UserAgreement;
