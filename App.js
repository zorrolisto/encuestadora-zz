import "react-native-gesture-handler";
import React from "react";
import { AppStateProvider } from "./src/hooks/Provider";
import Router from "./src/router/Router";

export default function App() {
  return (
    <AppStateProvider>
      <Router />
    </AppStateProvider>
  );
}
