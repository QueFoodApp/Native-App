import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, Linking, ActionSheetIOS, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const customerServicePhone = "+1 (647)-236-3656"; // Replace with your test number

const Contact = () => {
  
  const handlePhoneCall = () => {
    if (Platform.OS === 'ios') {
      // ✅ Show Action Sheet on iOS
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [`Call ${customerServicePhone}`, "Cancel"],
          destructiveButtonIndex: 0, // The "Call" option
          cancelButtonIndex: 1, // The "Cancel" option
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Linking.openURL(`tel:${customerServicePhone}`);
          }
        }
      );
    } else {
      // ✅ Direct Call for Android
      Alert.alert(
        "Confirm Call",
        `Call ${customerServicePhone}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Call", onPress: () => Linking.openURL(`tel:${customerServicePhone}`) }
        ]
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Contact Information',  
        headerTintColor: 'black',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Contact</Text>
          <Text style={styles.title}>Information</Text>
        </View>

        {/* Customer Service via Phone */}
        <TouchableOpacity style={styles.menuItem} onPress={handlePhoneCall}>
          <Ionicons name="call-outline" size={22} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Customer Service via Phone</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="black" />
        </TouchableOpacity>

        {/* Customer Service via Email (Placeholder) */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/email-support')}>
          <Ionicons name="mail-outline" size={22} color="black" style={styles.icon} />
          <Text style={styles.menuText}>Customer Service via Email</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="black" />
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>App Version: 1.0.12</Text>
      </SafeAreaView>
    </>
  );
};

// ✅ **Updated Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  customBackButton: {
    marginLeft: 10,
    padding: 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10, 
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20, 
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  icon: {
    marginRight: 15,
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
  },
  versionText: {
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 40,
  },
});

export default Contact;
