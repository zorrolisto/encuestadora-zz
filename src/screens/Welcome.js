import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeImage from "../../assets/images/welcome.png";
import { useNavigation } from "@react-navigation/native";

export default function Welcome() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex justify-around my-4">
        <Text className="text-gray-700 font-bold text-4xl text-center">
          Bienvenido Censador!
        </Text>
        <View className="flex-row justify-center">
          <Image source={WelcomeImage} style={{ width: 350, height: 350 }} />
        </View>
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
            className="py-3 bg-indigo-500 mx-7 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-white">
              Ingresa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
