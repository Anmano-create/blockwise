import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("All fields are required.");
      return;
    }
    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    await AsyncStorage.setItem(
      "blockwise_user",
      JSON.stringify({ email: email.toLowerCase(), hash })
    );
    Alert.alert("Account created!", "You can now log in.", [
      { text: "OK", onPress: () => navigation.navigate("Login") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.goBack}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>BlockWise</Text>

          <Ionicons
            name="school-outline"
            size={80}
            color="#333"
            style={styles.icon}
          />

          <Input
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
          />
          <Input
            icon="mail-outline"
            placeholder="Confirm Email"
            value={confirmEmail}
            onChange={setConfirmEmail}
            keyboardType="email-address"
          />
          <Input
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            secure
          />
          <Input
            icon="lock-closed-outline"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            secure
          />

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
            <Text style={styles.createText}>Create Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const Input = ({
  icon,
  placeholder,
  value,
  onChange,
  secure = false,
  keyboardType = "default",
}) => (
  <View style={styles.inputRow}>
    <Ionicons name={icon} size={20} color="#666" style={{ marginRight: 6 }} />
    <TextInput
      style={styles.inputField}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChange}
      secureTextEntry={secure}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: "#E2F9DB",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  goBack: { position: "absolute", top: 50, left: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 10 },
  icon: { marginVertical: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    marginVertical: 8,
  },
  inputField: { flex: 1, color: "#333" },
  error: { color: "red", marginTop: 4 },
  createBtn: {
    width: "100%",
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  createText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default SignupScreen;
