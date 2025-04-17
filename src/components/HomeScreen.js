import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const HomeScreen = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -60,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, [slideAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.titleContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Welcome to BlockWise!</Text>
      </Animated.View>

      <Ionicons
        name="school-outline"
        size={80}
        color="#333"
        style={styles.centerIcon}
      />

      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Choose an option to continue
      </Animated.Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="log-in-outline" size={20} color="#333" />
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Signup")}
          >
            <Ionicons name="person-add-outline" size={20} color="#333" />
            <Text style={styles.buttonText}>Create Account</Text>

            <TouchableOpacity
              onPress={() => setInfoVisible(!infoVisible)}
              style={styles.infoIconBtn}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#666"
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {infoVisible && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                By creating an account, you can save your preferences, earn more
                points for reading about issues and access more features!
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Categories")}
        >
          <Ionicons name="walk-outline" size={20} color="#333" />
          <Text style={styles.buttonText}>Continue as guest</Text>
        </TouchableOpacity>
      </View>
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
  titleContainer: {},
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  centerIcon: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  infoIconBtn: {
    marginLeft: "auto",
  },
  infoBox: {
    marginTop: 4,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
});

export default HomeScreen;
