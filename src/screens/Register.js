import SelectDropdown from "react-native-select-dropdown";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../hooks/Provider";
import { haveEmptyFields } from "../libs/object.helper";

const getRandomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [registro, setRegistro] = useState({
    address: String(getRandomNumberBetween(1, 200)) + " addres",
    nroPersonas: "3",
    income: "1000",
    nroMenores: "1",
    aguaPotable: true,
    luz: true,
    fechaTomada: new Date().toISOString().substring(0, 10),
    isInMemory: true,
  });
  const navigation = useNavigation();
  const { user, registros, saveRegistros } = useAppContext();

  const handleSaveRegistroInMemory = () => {
    // verify if all fields are filled
    if (isLoading) return;
    setIsLoading(true);
    if (haveEmptyFields(registro))
      return alert("Por favor llena todos los campos");
    saveRegistros([{ ...registro, censadorId: user.id }, ...registros]);
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-indigo-500">
      <SafeAreaView className="flex pb-0">
        <View className="mt-24 -mb-5">
          <Text className="text-white ml-4">
            Encuesta a la cabeza de familia
          </Text>
          <Text className="font-bold text-white ml-4 text-4xl">
            Añadir Registro
          </Text>
        </View>
      </SafeAreaView>
      <View
        className="flex-1 px-8 pt-8 bg-white space-y-3"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <ScrollView className="flex-1">
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Dirección de la vivienda</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={registro.address}
              onChangeText={(address) =>
                setRegistro((c) => ({ ...c, address }))
              }
              placeholder="Dirección"
            />
            <Text className="text-gray-700 ml-4">Número de habitantes</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={registro.nroPersonas}
              keyboardType="numeric"
              onChangeText={(nroPersonas) =>
                setRegistro((c) => ({ ...c, nroPersonas }))
              }
              placeholder="Nro de Personas"
            />
            <Text className="text-gray-700 ml-4">Ingreso aproximado</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={registro.income}
              keyboardType="numeric"
              onChangeText={(income) => setRegistro((c) => ({ ...c, income }))}
              placeholder="Ingreso aproximado"
            />
            <Text className="text-gray-700 ml-4">
              Número de menores de edad
            </Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              value={registro.nroMenores}
              keyboardType="numeric"
              onChangeText={(nroMenores) =>
                setRegistro((c) => ({ ...c, nroMenores }))
              }
              placeholder="Nro de Menores"
            />
            <Text className="text-gray-700 ml-4 mb-2">
              ¿Tienen agua potable?
            </Text>
            <SelectDropdown
              buttonStyle={{
                backgroundColor: "#f3f4f6",
                borderRadius: 16,
                width: "100%",
                marginBottom: 10,
              }}
              buttonTextStyle={{
                fontSize: 12,
                color: "#374151",
                textAlign: "left",
              }}
              rowTextStyle={{ fontSize: 12 }}
              data={[
                { id: 1, description: "Si", value: true },
                { id: 2, description: "No", value: false },
              ]}
              defaultValueByIndex={0}
              onSelect={(i) =>
                setRegistro((c) => ({ ...c, aguaPotable: i.value }))
              }
              buttonTextAfterSelection={(i) => i.description}
              rowTextForSelection={(i) => i.description}
            />
            <Text className="text-gray-700 ml-4 mb-2">¿Tienen luz?</Text>
            <SelectDropdown
              buttonStyle={{
                backgroundColor: "#f3f4f6",
                borderRadius: 16,
                width: "100%",
                marginBottom: 10,
              }}
              buttonTextStyle={{
                fontSize: 12,
                color: "#374151",
                textAlign: "left",
              }}
              rowTextStyle={{ fontSize: 12 }}
              data={[
                { id: 1, description: "Si", value: true },
                { id: 2, description: "No", value: false },
              ]}
              defaultValueByIndex={0}
              onSelect={(i) => setRegistro((c) => ({ ...c, luz: i.value }))}
              buttonTextAfterSelection={(i) => i.description}
              rowTextForSelection={(i) => i.description}
            />
          </View>
        </ScrollView>
        <View className="mb-5 space-y-2">
          <TouchableOpacity
            onPress={handleSaveRegistroInMemory}
            className="py-3 bg-indigo-500 rounded-xl"
          >
            <Text className="font-sm font-bold text-center text-white">
              {isLoading ? "Cargando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-3 border border-indigo-500 rounded-xl"
          >
            <Text className="font-sm font-bold text-center text-indigo-500">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
