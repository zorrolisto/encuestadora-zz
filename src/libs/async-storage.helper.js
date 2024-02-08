import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDataToAs = async (field, value) => {
  try {
    await AsyncStorage.setItem(
      `@MyStore:${field}`,
      typeof value !== "string" ? JSON.stringify(value) : value
    );
  } catch (error) {
    console.log("Error while saving: ", error);
  }
};

export const getDataFromAs = async (field) => {
  try {
    const value = await AsyncStorage.getItem(`@MyStore:${field}`);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  } catch (error) {
    console.log("Error while reading: ", error);
    return null;
  }
};

export const removeDataFromAs = async (field, value) => {
  try {
    await AsyncStorage.removeItem(`@MyStore:${field}`);
  } catch (error) {
    console.log("Error while removing: ", error);
  }
};
