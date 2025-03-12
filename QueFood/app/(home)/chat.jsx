import React, { useState } from "react";
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    //bot response (Replace this with actual AI response logic)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: "I'm an AI. How can I assist you?", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-4 py-2">
          {/* Chat Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className={`my-2 p-3 rounded-lg max-w-[80%] ${item.sender === "bot" ? "bg-gray-200 self-start" : "bg-blue-500 self-end"}`}>
                <Text className={`${item.sender === "bot" ? "text-black" : "text-white"} text-base`}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>

        <View className="flex-row items-center border-t border-gray-300 p-3">
          <TextInput
            className="flex-1 bg-gray-100 px-4 py-3 rounded-full text-base"
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={handleSendMessage} className="ml-3 bg-blue-500 p-3 rounded-full">
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
