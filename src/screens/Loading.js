import React from "react";
import { View, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View className="flex flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#38bdf8" />
    </View>
  );
}
