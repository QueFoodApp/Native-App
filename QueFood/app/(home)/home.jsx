// import React from 'react';
// import { SafeAreaView, View, Text, Button } from 'react-native';
// import { router } from 'expo-router';

// const Home = () => {
//   const handleLogout = () => {
//     router.push('/sign-in'); // Navigate back to the sign-in screen
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white justify-center items-center">
//       <Text className="text-2xl font-bold mb-4">Welcome to the Home Page!</Text>
//       <Text className="text-lg mb-8">You have successfully signed in.</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </SafeAreaView>
//   );
// };

// export default Home;

import React from 'react';
import { SafeAreaView, View, Text, Button, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Home = () => {
  
  const handleLogout = () => {
    router.push('/sign-in'); // Navigate back to the sign-in screen
  };

  const handleUserProfile = () => {
    router.push('/profile'); // Corrected path
  };
  

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Text className="text-2xl font-bold mb-4">Welcome to the Home Page!</Text>
      <Text className="text-lg mb-8">You have successfully signed in.</Text>

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />

      {/* Spacer */}
      <View style={{ height: 20 }} />

      {/* User Agreement Button */}
      <TouchableOpacity
        onPress={handleUserProfile}
        className="mt-4 bg-blue-500 p-3 rounded-lg"
      >
        <Text className="text-white text-lg">User Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
