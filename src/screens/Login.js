import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/solid";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import LoginImage from "../../assets/images/login.png";
import { useAppContext } from "../hooks/Provider";
import { CommonActions } from "@react-navigation/native";

const iconStyle = { position: "absolute", right: 10, top: 8 };
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const navigation = useNavigation();
  const [state, setState] = useState({ email: "a", password: "hola" });
  const [showPassword, setShowPassword] = useState(false);
  const { saveSecureToken, saveUser } = useAppContext();

  const onPressLogin = async () => {
    const haveEmptyFields = Object.values(state).some(
      (v) => !v || v.trim() === ""
    );
    if (haveEmptyFields) {
      alert("Por favor llena todos los campos");
      return;
    }
    try {
      const response = await fetch(apiUrl + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const user = await response.json();
      if (user.error) {
        alert(user.error);
        return;
      }
      saveSecureToken(user.token);
      saveUser({ ...user, token: undefined });
      resetToHome();
    } catch (e) {
      console.log("e", e);
    }
  };
  const resetToHome = () =>
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
    );

  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };
  const onPressSignUp = () => {
    /*
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN </Text>
      </TouchableOpacity>
    */
  };
  return (
    <View className="flex-1 " style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-indigo-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={LoginImage} style={{ width: 200, height: 200 }} />
        </View>
      </SafeAreaView>
      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white px-8 pt-8"
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Correo electrónico</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Ingresa tu correo"
            value={state.email}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            onChangeText={(email) => setState((c) => ({ ...c, email }))}
          />
          <Text className="text-gray-700 ml-4">Contraseña</Text>
          <View className="relative">
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-5"
              secureTextEntry={!showPassword}
              placeholder="Ingresa tu contraseña"
              value={state.password}
              onChangeText={(password) => setState((c) => ({ ...c, password }))}
            />
            {showPassword ? (
              <EyeSlashIcon
                style={iconStyle}
                color={"gray"}
                size={30}
                onPress={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeIcon
                style={iconStyle}
                color={"gray"}
                size={30}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}
          </View>
          <TouchableOpacity
            className="py-3 bg-indigo-500 rounded-xl"
            onPress={() => onPressLogin()}
          >
            <Text className="text-xl font-bold text-center text-gray-700">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="font-semibold text-yellow-500 ml-1">
              Registrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
