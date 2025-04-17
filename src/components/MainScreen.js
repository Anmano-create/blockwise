import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.text}>This is the Main Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2F9DB",
    alignItems: "center",
    justifyContent: "center",
  },
  goBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  text: {
    fontSize: 18,
  },
});

export default MainScreen;
