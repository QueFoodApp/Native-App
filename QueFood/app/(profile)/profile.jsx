import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { id: '1', title: 'Change Password', icon: 'lock-closed-outline', route: '/(auth)/reset-password' }, // ✅ Now links to Change Password
  { id: '2', title: 'Terms & Conditions', icon: 'document-text-outline', route: '/agreement' },
  { id: '3', title: 'Contact Information', icon: 'chatbox-ellipses-outline', route: '/(contact)/contact' },
  { id: '4', title: 'Logout', icon: 'log-out-outline', route: '/sign-in' },
];

const Profile = () => {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'User Profile',  
        headerTintColor: 'black',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.customBackButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>User</Text>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Menu */}
        <View style={styles.menuContainer}>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.menuItem, item.id === '4' && styles.logoutItem]} 
                onPress={() => router.push(item.route)}
              >
                <Ionicons name={item.icon} size={24} color="black" style={styles.icon} />
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="black" />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>App Version: 1.0.12</Text>
      </SafeAreaView>
    </>
  );
};

// ✅ Styling for correct spacing & alignment
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
    paddingVertical: 10,
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
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logoutItem: {
    borderTopWidth: 8,
    borderTopColor: '#F3F3F3',
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
  },
  versionText: {
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 30,
  },
});

export default Profile;
