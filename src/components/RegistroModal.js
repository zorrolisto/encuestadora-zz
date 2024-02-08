import { View, Text, Modal, TouchableOpacity, FlatList } from "react-native";

const labels = {
  nroPersonas: "Número de personas",
  income: "Ingreso mensual",
  nroMenores: "Número de menores",
  aguaPotable: "Tiene agua potable",
  luz: "Tiene luz eléctrica",
  fechaTomada: "Fecha de registro",
};

export default function RegistroModal({
  modalVisible,
  setModalVisible,
  registro,
}) {
  const setLabelToResponse = (value) => {
    if (value === true) return "Si";
    if (value === false) return "No";
    return value;
  };
  const extractNonShowableFields = ([key, value]) => {
    return (
      key !== "id" &&
      key !== "key" &&
      key !== "isInMemory" &&
      key !== "censadorId" &&
      key !== "address"
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="m-5 bg-white rounded-2xl p-4 items-center shadow-sm w-11/12 h-3/5">
          <View className="w-full mb-3">
            <Text
              className={
                `font-bold text-left text-lg ` +
                (registro?.isInMemory ? "text-red-500" : "text-green-500")
              }
            >
              {registro?.isInMemory ? "En Memoria" : "En Servidor"}
            </Text>
            <Text className="text-gray-700 font-bold text-left text-lg">
              Dirección: {registro?.address}
            </Text>
          </View>
          <View className="flex-1">
            {registro && (
              <FlatList
                data={Object.entries(registro).filter(extractNonShowableFields)}
                renderItem={({ item: [key, value] }) => (
                  <View className="w-full flex-row items-center justify-between p-2 border-b border-b-gray-100">
                    <View className="flex-row gap-3 w-3/5">
                      <Text className="text-gray-700">{labels[key]}</Text>
                    </View>
                    <View className="p-2 rounded-xl">
                      <Text className="font-bold text-gray-700">
                        {setLabelToResponse(value)}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
          <View className="w-full">
            <TouchableOpacity
              className="py-3 bg-indigo-500 rounded-xl"
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text className="font-sm font-bold text-center text-white">
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
