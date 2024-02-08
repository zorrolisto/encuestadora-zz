import { createContext, useContext, useEffect, useState } from "react";
import {
  getDataFromAs,
  removeDataFromAs,
  saveDataToAs,
} from "../libs/async-storage.helper";
import { getSecureValueFor, saveSecure } from "../libs/secure-store.helper";

const AppStateContext = createContext(null);

export const AppStateProvider = (props) => {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState({});
  const [registros, setRegistros] = useState([]);
  const [lastRegister, setLastRegister] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    void getDataFromStorages();
  }, []);

  const getDataFromStorages = async () => {
    const isRegister = (await getDataFromAs("isRegister")) || null;
    const user = (await getDataFromAs("user")) || null;
    const registros = (await getDataFromAs("registros")) || [];
    const lastRegister = (await getDataFromAs("lastRegister")) || "26/10/2023";
    const token = (await getSecureToken()) || null;
    setIsRegister(isRegister === "true");
    setUser(user);
    setToken(token);
    setRegistros(registros);
    setLastRegister(lastRegister);
    setIsLoadingApp(false);
  };
  const getRegistros = () => registros;
  const saveUser = async (u) => {
    const userUpdated = { ...user, ...u };
    setUser({ ...userUpdated });
    await saveDataToAs("user", userUpdated);
  };
  const getAmountOfRegistrosInMemory = () =>
    registros.filter((r) => r.inMemory).length;
  const saveIsRegister = () => {
    setIsRegister(true);
    void saveDataToAs("isRegister", true);
  };
  const saveRegistros = (registros) => {
    setRegistros(registros);
    void saveDataToAs("registros", registros);
  };
  const saveLastRegister = (lastRegister) => {
    setLastRegister(lastRegister);
    void saveDataToAs("lastRegister", lastRegister);
  };
  const resetEverything = async () => {
    setIsLoadingApp(true);
    setIsRegister(false);
    await removeDataFromAs("isRegister");
    setUser(null);
    await removeDataFromAs("user");
    setRegistros([]);
    setLastRegister(null);
    await removeDataFromAs("registros");
    setIsLoadingApp(false);
  };
  const saveSecureToken = async (token) => {
    await saveSecure("token", token);
  };
  const getSecureToken = async (token) =>
    await getSecureValueFor("token", token);

  return (
    <AppStateContext.Provider
      value={{
        isRegister,
        saveIsRegister,
        user,
        saveUser,
        registros,
        saveRegistros,
        isLoadingApp,
        lastRegister,
        saveLastRegister,
        saveSecureToken,
        getSecureToken,
        resetEverything,
        setIsLoadingApp,
        getRegistros,
        getAmountOfRegistrosInMemory,
        token,
      }}
    >
      {props.children}
    </AppStateContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppStateContext);
  if (!context)
    throw new Error("useAppContext must be used within a AppStateProvider");
  return context;
}
