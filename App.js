import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { ThemeProvider } from "./src/context/ThemeContext.js";

import WelcomeScreen from "./src/components/WelcomeScreen.js";
import HomeScreen from "./src/components/HomeScreen.js";
import LoginScreen from "./src/components/LoginScreen.js";
import SignupScreen from "./src/components/SignupScreen.js";
import CategoriesScreen from "./src/components/CategoriesScreen.js";

import MainScreen from "./src/components/MainScreen.js";
import ExploreScreen from "./src/components/ExploreScreen.js";
import SavedScreen from "./src/components/SavedScreen.js";
import SettingsScreen from "./src/components/SettingsScreen.js";

import AboutScreen from "./src/components/AboutScreen.js";
import CategoryFeedScreen from "./src/components/CategoryFeedScreen.js";
import StoryDetailScreen from "./src/components/StoryDetailScreen.js";
import FeedbackScreen from "./src/components/FeedbackScreen.js";

const Root = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Main"
      component={MainScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={ExploreScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Saved"
      component={SavedScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bookmark-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const RootNav = () => (
  <NavigationContainer>
    <Root.Navigator screenOptions={{ headerShown: false }}>
      <Root.Screen name="Welcome" component={WelcomeScreen} />
      <Root.Screen name="Home" component={HomeScreen} />
      <Root.Screen name="Login" component={LoginScreen} />
      <Root.Screen name="Signup" component={SignupScreen} />
      <Root.Screen name="Categories" component={CategoriesScreen} />
      <Root.Screen name="MainTabs" component={MainTabs} />
      <Root.Screen name="About" component={AboutScreen} />
      <Root.Screen name="CategoryFeed" component={CategoryFeedScreen} />
      <Root.Screen name="StoryDetail" component={StoryDetailScreen} />
      <Root.Screen name="Feedback" component={FeedbackScreen} />
    </Root.Navigator>
  </NavigationContainer>
);

export default function App() {
  return (
    <ThemeProvider>
      <RootNav />
    </ThemeProvider>
  );
}
