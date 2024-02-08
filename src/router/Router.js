import { createStackNavigator } from "@react-navigation/stack";
import { useAppContext } from "../hooks/Provider";
import { NavigationContainer } from "@react-navigation/native";
import SignUp from "../screens/SignUp";
import Welcome from "../screens/Welcome";
import List from "../screens/List";
import Home from "../screens/Home";
import Account from "../screens/Account";
import Loading from "../screens/Loading";
import Register from "../screens/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
} from "react-native-heroicons/solid";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome">
        {(props) => <Welcome {...props} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUp {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const StackRegistro = createStackNavigator();

const RegistroStack = () => {
  return (
    <StackRegistro.Navigator
      initialRouteName="Listed"
      screenOptions={{ headerShown: false }}
    >
      <StackRegistro.Screen name="Listed">
        {(props) => <List {...props} />}
      </StackRegistro.Screen>
      <StackRegistro.Screen name="Register">
        {(props) => <Register {...props} />}
      </StackRegistro.Screen>
    </StackRegistro.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <HomeIcon size={size} color={focused ? "#3b82f6" : color} />
          ),
        }}
      >
        {(props) => <Home {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="List"
        options={{
          tabBarLabel: "Registros",
          tabBarIcon: ({ focused, size, color }) => (
            <DocumentTextIcon size={size} color={focused ? "#3b82f6" : color} />
          ),
        }}
      >
        {(props) => <RegistroStack {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Account"
        options={{
          tabBarLabel: "Cuenta",
          tabBarIcon: ({ focused, size, color }) => (
            <UserIcon size={size} color={focused ? "#3b82f6" : color} />
          ),
        }}
      >
        {(props) => <Account {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default function Router() {
  const { user, isInitializing } = useAppContext();

  if (isInitializing) return <Loading />;

  return (
    <NavigationContainer>
      {!!user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
