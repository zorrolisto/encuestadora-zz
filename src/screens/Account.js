import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../hooks/Provider";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Account() {
  const [state, setState] = useState({
    name: "Julio",
    email: "j@mail.com",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, saveUser, resetEverything, token } = useAppContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      const { id, name, email } = user;
      setState({ id, name, email });
    }
  }, []);

  const handleUpdateUsuario = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const haveEmptyFields = Object.values({
      e: state.email,
      n: state.name,
    }).some((v) => !v || v.trim() === "");
    if (haveEmptyFields) return alert("Por favor llena todos los campos");
    try {
      const res = await fetch(apiUrl + "/api/user/id?id=" + state.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: token },
        body: JSON.stringify(state),
      });
      const { userUpdated, error } = await res.json();
      if (error) return alert(error);
      alert("Actualizado correctamente");
      saveUser({ ...userUpdated });
    } catch (e) {
      alert("Error al actualizar el registro");
    }
    setIsLoading(false);
  };
  const handleCerrarSesion = () => {
    resetEverything();
  };

  return (
    <View className="flex-1 bg-indigo-500">
      <SafeAreaView className="flex pb-0">
        <View className="mt-24 -mb-5">
          <Text className="text-white ml-4">
            Actualiza los datos que tienen tuyos
          </Text>
          <Text className="font-bold text-white ml-4 text-4xl">Mi Cuenta</Text>
        </View>
      </SafeAreaView>
      <View
        className="flex-1 px-8 pt-8 bg-white"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Nombre Completo</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            value={state.name}
            onChangeText={(name) => setState((c) => ({ ...c, name }))}
            placeholder="Ingresa tu nombre"
          />
          <Text className="text-gray-700 ml-4">Correo Electrónico</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Ingresa tu correo"
            value={state.email}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            onChangeText={(email) => setState((c) => ({ ...c, email }))}
          />
          <TouchableOpacity
            className="py-3 bg-indigo-500 rounded-xl"
            onPress={handleUpdateUsuario}
          >
            <Text className="font-xl font-bold text-center text-white">
              {isLoading ? "Cargando..." : "Actualizar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 bg-red-500 rounded-xl"
            onPress={handleCerrarSesion}
          >
            <Text className="font-xl font-bold text-center text-white">
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
