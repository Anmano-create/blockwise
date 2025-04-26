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
import ThemedView from "../components/ThemedView.js";
import { useTheme } from "../context/ThemeContext.js";

const SignupScreen = ({ navigation }) => {
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = dark ? "#fff" : "#000";
  const sub = dark ? "#999" : "#333";

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!email || !password) {
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

  const Input = ({ icon, placeholder, value, onChange, secure = false }) => (
    <View style={[st.inputRow, { backgroundColor: card }]}>
      <Ionicons name={icon} size={20} color={sub} style={{ marginRight: 6 }} />
      <TextInput
        style={[st.inputField, { color: txt }]}
        placeholder={placeholder}
        placeholderTextColor={sub}
        secureTextEntry={secure}
        autoCapitalize="none"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );

  return (
    <ThemedView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[st.container, { backgroundColor: bg }]}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={st.back}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={txt} />
            </TouchableOpacity>

            <Text style={[st.title, { color: txt, fontSize: 26 * fontScale }]}>
              BlockWise
            </Text>
            <Ionicons
              name="school-outline"
              size={80}
              color={txt}
              style={st.icon}
            />

            <Input
              icon="mail-outline"
              placeholder="Email Address"
              value={email}
              onChange={setEmail}
            />
            <Input
              icon="mail-outline"
              placeholder="Confirm Email Address"
              value={confirmEmail}
              onChange={setConfirmEmail}
            />
            <Input
              icon="lock-closed-outline"
              placeholder="Password"
              secure
              value={password}
              onChange={setPassword}
            />
            <Input
              icon="lock-closed-outline"
              placeholder="Confirm Password"
              secure
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {error !== "" && (
              <Text style={[st.error, { fontSize: 13 * fontScale }]}>
                {error}
              </Text>
            )}

            <TouchableOpacity style={st.createBtn} onPress={handleCreate}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16 * fontScale,
                  fontWeight: "600",
                }}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const st = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  back: { position: "absolute", top: 50, left: 20 },
  title: { fontWeight: "bold", marginTop: 10 },
  icon: { marginVertical: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    marginVertical: 8,
  },
  inputField: { flex: 1 },
  error: { color: "red", marginTop: 4 },
  createBtn: {
    width: "100%",
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
});

export default SignupScreen;
