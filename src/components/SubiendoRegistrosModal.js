import { View, Text, Modal, TouchableOpacity } from "react-native";

export default function SubiendoRegistrosModal({
  modalVisible,
  setModalVisible,
  info,
  setCancelUpload,
}) {
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
        <View className="m-5 bg-white rounded-2xl p-4 items-center shadow-sm w-11/12">
          <View className="w-full mb-1">
            <Text className="text-gray-700 text-center text-md">
              Subiendo: {info?.nroDeRegistrosSubidos} / {info?.totalDeRegistros}
            </Text>
          </View>
          <View className="w-full mb-3">
            <Text className="text-gray-700 font-bold text-center text-4xl">
              {Math.round(
                (info?.nroDeRegistrosSubidos / info?.totalDeRegistros) * 100
              )}
              %
            </Text>
          </View>
          <View className="w-full">
            <TouchableOpacity
              className={
                "py-3 rounded-xl " +
                (info.totalDeRegistros - info.nroDeRegistrosSubidos === 0
                  ? "bg-green-500"
                  : "bg-red-500")
              }
              onPress={() => {
                if (info.totalDeRegistros - info.nroDeRegistrosSubidos !== 0)
                  setCancelUpload(true);
                setModalVisible(!modalVisible);
              }}
            >
              <Text className="font-sm font-bold text-center text-white">
                {info.totalDeRegistros - info.nroDeRegistrosSubidos === 0
                  ? "Ok"
                  : "Cancelar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
