import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Link } from "expo-router";
import "../global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-3xl"> QueFood</Text>
        <StatusBar />
        <Link href="/profile">Go To Profile</Link>
    </View>
  );
}


