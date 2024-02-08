import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../hooks/Provider";
import { saludo } from "../libs/date.helper";
import { Dimensions } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import SubiendoRegistrosModal from "../components/SubiendoRegistrosModal";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const avanceCampañaDefault = [
  { label: "Registros en memoria", value: "..." },
  { label: "Registros subidos", value: "..." },
  { label: "Registros hechos", value: "..." },
  { label: "Última fecha de subida", value: "..." },
  { label: "Total de casas", value: "..." },
  { label: "Registros faltantes", value: "..." },
];
const formatToAvanceCampaña = (avanceCampana, nrodeRegistrosEnMemoria) => [
  { label: "Registros en memoria", value: nrodeRegistrosEnMemoria },
  { label: "Registros subidos", value: avanceCampana.registrosSubidos },
  {
    label: "Registros hechos",
    value: avanceCampana.registrosSubidos + nrodeRegistrosEnMemoria,
  },
  {
    label: "Última fecha de subida",
    value: avanceCampana.ultimaFechaDeSubida
      ? avanceCampana.ultimaFechaDeSubida.substring(5, 10).replace("-", "/")
      : "Nunca",
  },
  { label: "Total de casas", value: avanceCampana.casasPorCensador },
  {
    label: "Registros faltantes",
    value:
      avanceCampana.casasPorCensador -
      (nrodeRegistrosEnMemoria + avanceCampana.registrosSubidos),
  },
];

export default function SignUp() {
  const { user, token, saveRegistros, registros } = useAppContext();
  const [avanceCampañaSinFormato, setAvanceCampañaSinFormato] = useState(null);
  const [avanceCampaña, setAvanceCampaña] = useState(avanceCampañaDefault);
  const [cancelUpload, setCancelUpload] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [info, setInfo] = useState({});
  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (avanceCampaña[0].value !== "..." || !token) return;
    void getAvanceCampaña();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAvanceCampaña();
    setRefreshing(false);
  };
  const getAvanceCampaña = async (updateAvanceCampaña = true) => {
    try {
      const res = await fetch(
        apiUrl + "/api/avance-campana?censadorId=" + user.id,
        { headers: { authorization: token } }
      );
      const { error, avanceCampana } = await res.json();
      if (error) return alert(error);
      setAvanceCampañaSinFormato(avanceCampana);
      if (updateAvanceCampaña) {
        setAvanceCampaña(
          formatToAvanceCampaña(avanceCampana, registros.length)
        );
      }
    } catch (e) {
      return alert("Error al obtener avance de campaña");
    }
  };
  const subirRegistros = async (registrosToUpload) => {
    try {
      const response = await fetch(apiUrl + "/api/subir-registros", {
        method: "POST",
        headers: { authorization: token },
        body: JSON.stringify(registrosToUpload),
      });
      const { error } = await response.json();
      if (error) {
        alert(error);
        return false;
      }
    } catch (e) {
      console.log("e", e);
      alert("Error al subir registros");
      return false;
    }
    return true;
  };
  const updateAvanceCampaña = async (
    registrosEnMemoriaLength,
    registrosSubidos
  ) => {
    const updatedInformationForCampaña = {
      registrosSubidos:
        registrosSubidos + avanceCampañaSinFormato.registrosSubidos,
      ultimaFechaDeSubida: new Date().toISOString().substring(0, 10),
      registrosEnMemoria: registrosEnMemoriaLength,
    };
    try {
      const res = await fetch(
        apiUrl + "/api/avance-campana?campanaId=" + avanceCampañaSinFormato.id,
        {
          method: "PUT",
          headers: { authorization: token },
          body: JSON.stringify(updatedInformationForCampaña),
        }
      );
      const { error } = await res.json();
      if (error) return alert(error);
      setAvanceCampaña(
        formatToAvanceCampaña(
          { ...avanceCampañaSinFormato, ...updatedInformationForCampaña },
          registrosEnMemoriaLength
        )
      );
      getAvanceCampaña(false);
    } catch (e) {
      return alert("Error al obtener avance de campaña");
    }
  };
  const verifyAndUpload = async () => {
    if (registros.length === 0)
      return alert("No hay registros en memoria para subir.");
    let registrosEnMemoria = [...registros];
    setInfo({
      totalDeRegistros: registrosEnMemoria.length,
      nroDeRegistrosSubidos: 0,
    });
    let registrosSubidos = 0;
    while (registrosEnMemoria.length > 0) {
      setModalVisible(true);
      if (!isConnected) {
        alert("No hay internet por el momento, intente nuevamente más tarde.");
        setModalVisible(false);
        break;
      }
      if (cancelUpload) {
        setCancelUpload(false);
        return await updateAvanceCampaña();
      }
      const registrosToUpload = registrosEnMemoria.splice(0, 10);
      const success = await subirRegistros(registrosToUpload);
      if (!success) {
        setModalVisible(false);
        return await updateAvanceCampaña();
      }
      saveRegistros([...registrosEnMemoria]);
      setInfo((i) => ({
        ...i,
        nroDeRegistrosSubidos:
          i.nroDeRegistrosSubidos + registrosToUpload.length,
      }));
      registrosSubidos += registrosToUpload.length;
    }

    await updateAvanceCampaña([...registrosEnMemoria].length, registrosSubidos);
  };

  return (
    <View className="flex-1 bg-indigo-500">
      <SafeAreaView className="flex pb-0">
        <View className="mt-24 -mb-5">
          <Text className="text-white ml-4">
            Dashboard con la información actualizada
          </Text>
          <Text className="font-bold text-white ml-4 text-4xl">
            {saludo()} {(user?.name ?? "").split(" ")[0]}
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView
        className="flex-1 px-8 pt-8 bg-white"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-gray-700 font-bold">
              Avance de sus registros
            </Text>
            <View className="flex-wrap flex-row justify-between gap-2">
              {avanceCampaña.map((i, idx) => (
                <View
                  key={idx}
                  className="border border-indigo-300 p-2 rounded-lg"
                  style={{ width: Dimensions.get("window").width / 2 - 36 }}
                >
                  <Text className="text-gray-700 mb-2">{i.label}</Text>
                  <View>
                    <Text className="text-gray-700 font-bold text-4xl">
                      {i.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity
            className="py-3 bg-indigo-500 rounded-xl"
            onPress={verifyAndUpload}
          >
            <Text className="font-xl font-bold text-center text-white">
              Verificar internet y {"\n"} subir registros en memoria
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SubiendoRegistrosModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        info={info}
      />
    </View>
  );
}
