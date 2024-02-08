import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import SignUpImage from "../../assets/images/signup.png";
import { useAppContext } from "../hooks/Provider";
import { haveEmptyFields } from "../libs/object.helper";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function SignUp() {
  const [state, setState] = useState({
    email: "cristian@mail.com",
    password: "hola",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoadingApp, saveSecureToken, saveUser } = useAppContext();
  const navigation = useNavigation();

  const handleRegistrate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (haveEmptyFields(state)) {
      alert("Por favor llena todos los campos");
      return;
    }
    try {
      const res = await fetch(apiUrl + "/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const { user, token, error } = await res.json();
      if (error) return alert(error);
      if (user.rol !== "Censador") return alert("Solo censadores");
      saveSecureToken(token);
      setIsLoadingApp(true);
      await saveUser({ ...user });
      setIsLoadingApp(false);
    } catch (e) {
      alert("Error al ingresar. Intentalo de nuevo");
    }
  };

  return (
    <View className="flex-1 bg-indigo-500">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={SignUpImage} style={{ width: 165, height: 110 }} />
        </View>
      </SafeAreaView>
      <View
        className="flex-1 px-8 pt-8 bg-white"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Correo</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={state.email}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            onChangeText={(email) => setState((c) => ({ ...c, email }))}
            placeholder="Ingresa tu correo"
          />
          <Text className="text-gray-700 ml-4">Contraseña</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Ingresa tu contraseña"
            value={state.password}
            onChangeText={(password) => setState((c) => ({ ...c, password }))}
            secureTextEntry={true}
          />
          <TouchableOpacity
            className="py-3 bg-indigo-500 rounded-xl"
            onPress={handleRegistrate}
          >
            <Text className="font-xl font-bold text-center text-white">
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
