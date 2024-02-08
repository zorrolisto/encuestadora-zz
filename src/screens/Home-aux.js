import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAppContext } from "../hooks/Provider";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Home() {
  const { token } = useAppContext();
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getWelcome();
  }, []);

  const getWelcome = async () => {
    try {
      const response = await fetch(apiUrl + "/welcome", {
        headers: { "x-access-token": token },
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error.message);
        return;
      }
      setMessage(data.message);
    } catch (e) {
      console.log("e", e);
    }
  };
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-red-300">{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
