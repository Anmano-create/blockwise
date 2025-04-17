import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { WelcomeScreen } from "./src/components/WelcomeScreen.js";
import { HomeScreen } from "./src/components/HomeScreen.js";
import { LoginScreen } from "./src/components/LoginScreen.js";
import { SignupScreen } from "./src/components/SignupScreen.js";
import { CategoriesScreen } from "./src/components/CategoriesScreen.js";
import { MainScreen } from "./src/components/MainScreen.js";

const Stack = createStackNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
