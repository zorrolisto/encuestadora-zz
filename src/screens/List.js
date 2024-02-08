import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "../hooks/Provider";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
} from "react-native-heroicons/solid";
import RegistroModal from "../components/RegistroModal";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function List() {
  const [modalVisible, setModalVisible] = useState(false);
  const [registroSelected, setRegistroSelected] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [count, setCount] = useState(0);
  const [registrosOffset, setRegistrosOffset] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    total: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetAlready, setIsResetAlready] = useState(true);
  // refresh with scroll view, down here
  const [refreshing, setRefreshing] = useState(false);
  const { token, registros: registrosInMemory, user } = useAppContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (isResetAlready === true) void getRegistros();
  }, [pagination.page]);
  useEffect(() => {
    void resetList();
  }, [registrosInMemory]);
  useEffect(() => {
    const reset = async () => {
      await getRegistros();
      setIsResetAlready(true);
    };
    void reset();
  }, [isRefreshing]);
  useEffect(() => {
    if (isResetAlready === true) setRefreshing(false);
  }, [isResetAlready]);

  const onRefresh = React.useCallback(async () => {
    resetList();
    setRefreshing(true);
  }, []);
  const resetList = () => {
    setIsResetAlready(false);
    setRegistros([]);
    setIsLoading(false);
    setLastPage(1);
    setCount(0);
    setRegistrosOffset(0);
    setPagination({ page: 1, limit: 7, total: 0 });
    setIsRefreshing((c) => !c);
  };
  const getRegistros = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const registrosInMemoryForThisPage = registrosInMemory.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit
    );
    if (registrosInMemoryForThisPage.length === pagination.limit) {
      setRegistros(
        registrosInMemoryForThisPage.map((r, key) => ({ ...r, key }))
      );
      setIsLoading(false);
      if (pagination.page !== 1) {
        setLastPage(
          Math.ceil((count + registrosInMemory.length) / pagination.limit)
        );
        setPagination({
          ...pagination,
          total: count + registrosInMemory.length,
        });
        return;
      }
    }
    try {
      const pageOffset =
        pagination.page !== 1
          ? Math.ceil(registrosInMemory.length / pagination.limit)
          : 0;
      const newLimit =
        registrosInMemoryForThisPage.length === pagination.limit
          ? pagination.limit
          : pagination.limit - registrosInMemoryForThisPage.length;
      const regOff = newLimit !== pagination.limit ? newLimit : registrosOffset;
      setRegistrosOffset(regOff);
      const res = await fetch(
        apiUrl +
          "/api/registro?censadorId=" +
          user.id +
          "&page=" +
          (pagination.page - pageOffset) +
          "&limit=" +
          newLimit +
          "&offset=" +
          (registrosInMemoryForThisPage.length > 0 ? 0 : regOff),
        { headers: { authorization: token } }
      );
      const { error, registros, count: countRes } = await res.json();
      if (error) return alert(error);
      if (countRes) {
        setCount(countRes.total);
        setLastPage(
          Math.ceil(
            (countRes.total + registrosInMemory.length) / pagination.limit
          )
        );
        setPagination({
          ...pagination,
          total: countRes.total + registrosInMemory.length,
        });
      } else {
        setLastPage(
          Math.ceil((count + registrosInMemory.length) / pagination.limit)
        );
        setPagination({
          ...pagination,
          total: count + registrosInMemory.length,
        });
      }
      if (registrosInMemoryForThisPage.length !== pagination.limit)
        setRegistros(
          [...registrosInMemoryForThisPage, ...registros].map((r, key) => ({
            ...r,
            key,
          }))
        );
      setIsLoading(false);
    } catch (e) {
      console.log("e", e);
      return alert("Error al obtener registros");
    }
  };
  const goToPreviousPage = () => {
    if (pagination.page === 1) return;
    setPagination({ ...pagination, page: pagination.page - 1 });
  };
  const goToNextPage = () => {
    if (pagination.page === lastPage) return;
    setPagination({ ...pagination, page: pagination.page + 1 });
  };
  const onPressShowRegistro = (registro) => {
    setModalVisible(true);
    setRegistroSelected(registro);
  };

  return (
    <View className="flex-1 bg-indigo-500">
      <SafeAreaView className="flex pb-0">
        <View className="mt-24 -mb-5">
          <Text className="text-white ml-4">
            Registros que has hecho hasta el momento
          </Text>
          <Text className="font-bold text-white ml-4 text-4xl">
            Lista de Registros
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView
        className="flex-1 px-8 pt-8 bg-white"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <TouchableOpacity
          className="py-3 bg-indigo-500 rounded-xl"
          onPress={() => navigation.navigate("Register")}
        >
          <Text className="font-xl font-bold text-center text-white">
            Agregar Registro
          </Text>
        </TouchableOpacity>
        <View className="mt-4">
          {isLoading && (
            <Text className="text-gray-400 my-5 text-center">CARGANDO...</Text>
          )}
          {registros.map((item, idx) => (
            <View
              key={idx}
              className={`flex-row items-center justify-between p-2 mb-1.5 rounded-xl ${
                item.isInMemory ? "bg-gray-200" : "bg-green-200"
              }`}
            >
              <View className="flex-row gap-3">
                <Text className="text-gray-700">{item.fechaTomada}</Text>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-gray-700">
                  {item.address.substring(0, 15)} ...
                </Text>
              </View>
              <TouchableOpacity
                className="p-1.5 bg-indigo-500 rounded-xl"
                onPress={() => onPressShowRegistro(item)}
              >
                <EyeIcon size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          <View className="flex-row justify-center mt-2">
            <TouchableOpacity
              className="p-2.5 bg-indigo-500 rounded-xl"
              onPress={goToPreviousPage}
            >
              <ArrowLeftIcon size={20} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-3 items-center p-2">
              <Text className="text-gray-700">
                {pagination.page} de {lastPage} ({pagination.total})
              </Text>
            </View>
            <TouchableOpacity
              className="p-2.5 bg-indigo-500 rounded-xl"
              onPress={goToNextPage}
            >
              <ArrowRightIcon size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <RegistroModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        registro={registroSelected}
      />
    </View>
  );
}
