import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
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

const LoginScreen = ({ navigation, route }) => {
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = dark ? "#fff" : "#000";
  const sub = dark ? "#aaa" : "#555";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginErr] = useState("");

  const [modalVisible, setModal] = useState(false);
  const [step, setStep] = useState("email");
  const [resetEmail, setREmail] = useState("");
  const [newPass, setNP] = useState("");
  const [confirmPass, setCP] = useState("");
  const [resetError, setRErr] = useState("");

  const fromSettings = route.params?.origin === "Settings";

  useEffect(() => {
    if (route.params?.forgot) setModal(true);
  }, [route.params]);

  const attemptLogin = async () => {
    const stored = await AsyncStorage.getItem("blockwise_user");
    if (!stored) {
      setLoginErr("No account found. Sign up first.");
      return;
    }
    const { email: saved, hash } = JSON.parse(stored);
    const tryHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    if (saved !== email.toLowerCase() || tryHash !== hash) {
      setLoginErr("Incorrect email or password.");
      return;
    }
    setLoginErr("");
    await AsyncStorage.setItem("current_user", email.toLowerCase());
    navigation.reset({ index: 0, routes: [{ name: "Categories" }] });
  };

  const handleEmailNext = async () => {
    const stored = await AsyncStorage.getItem("blockwise_user");
    if (!stored) {
      setRErr("No account found.");
      return;
    }
    const { email: saved } = JSON.parse(stored);
    if (saved !== resetEmail.toLowerCase()) {
      setRErr("E-mail does not match account.");
      return;
    }
    setRErr("");
    setStep("newpass");
  };

  const handleSetNewPass = async () => {
    if (!newPass || !confirmPass) {
      setRErr("All fields required.");
      return;
    }
    if (newPass !== confirmPass) {
      setRErr("Passwords do not match.");
      return;
    }
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      newPass
    );
    await AsyncStorage.setItem(
      "blockwise_user",
      JSON.stringify({ email: resetEmail.toLowerCase(), hash })
    );
    Alert.alert("Password updated!", "You can now log in.");
    closeModal();
  };

  const closeModal = () => {
    setModal(false);
    setStep("email");
    setREmail("");
    setNP("");
    setCP("");
    setRErr("");
    if (fromSettings) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "Settings" } }],
      });
    }
  };

  return (
    <ThemedView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: bg }]}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.back}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={txt} />
            </TouchableOpacity>

            <Text
              style={[styles.title, { color: txt, fontSize: 26 * fontScale }]}
            >
              BlockWise
            </Text>

            {fromSettings && (
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      { name: "MainTabs", params: { screen: "Settings" } },
                    ],
                  })
                }
              >
                <Text
                  style={[
                    styles.forgot,
                    { color: sub, fontSize: 14 * fontScale, marginTop: 4 },
                  ]}
                >
                  Back to Settings
                </Text>
              </TouchableOpacity>
            )}

            <Ionicons
              name="school-outline"
              size={80}
              color={txt}
              style={{ marginVertical: 20 }}
            />

            <View style={[styles.inputWrap, { backgroundColor: card }]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={sub}
                style={{ marginRight: 6 }}
              />
              <TextInput
                style={[styles.input, { color: txt }]}
                placeholder="Email Address"
                placeholderTextColor={sub}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[styles.inputWrap, { backgroundColor: card }]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={sub}
                style={{ marginRight: 6 }}
              />
              <TextInput
                style={[styles.input, { color: txt }]}
                placeholder="Password"
                placeholderTextColor={sub}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {loginError !== "" && (
              <Text style={[styles.err, { fontSize: 13 * fontScale }]}>
                {loginError}
              </Text>
            )}

            <TouchableOpacity style={styles.loginBtn} onPress={attemptLogin}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16 * fontScale,
                  fontWeight: "600",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModal(true)}
            >
              <Text
                style={[
                  styles.forgot,
                  { color: txt, fontSize: 14 * fontScale },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={closeModal}
            >
              <View style={styles.overlay}>
                <View style={[styles.modalBox, { backgroundColor: card }]}>
                  {step === "email" && (
                    <>
                      <Text style={[styles.mTitle, { color: txt }]}>
                        Forgot your password?
                      </Text>
                      <Text style={[styles.mMsg, { color: sub }]}>
                        Enter the e-mail you signed up with and create a new
                        password.
                      </Text>
                      <TextInput
                        style={[
                          styles.mInput,
                          {
                            backgroundColor: dark ? "#222" : "#f9f9f9",
                            color: txt,
                          },
                        ]}
                        placeholder="Email address"
                        placeholderTextColor={sub}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={resetEmail}
                        onChangeText={setREmail}
                      />
                      {resetError !== "" && (
                        <Text
                          style={[styles.err, { fontSize: 13 * fontScale }]}
                        >
                          {resetError}
                        </Text>
                      )}
                      <View style={styles.mRow}>
                        <Pressable
                          style={[styles.mBtn, { backgroundColor: "#ccc" }]}
                          onPress={closeModal}
                        >
                          <Text style={styles.mBtnTxt}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.mBtn, { backgroundColor: "#3b82f6" }]}
                          onPress={handleEmailNext}
                        >
                          <Text style={[styles.mBtnTxt, { color: "#fff" }]}>
                            Next
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}

                  {step === "newpass" && (
                    <>
                      <Text style={[styles.mTitle, { color: txt }]}>
                        Set new password
                      </Text>
                      <TextInput
                        style={[
                          styles.mInput,
                          {
                            backgroundColor: dark ? "#222" : "#f9f9f9",
                            color: txt,
                          },
                        ]}
                        placeholder="New password"
                        placeholderTextColor={sub}
                        secureTextEntry
                        value={newPass}
                        onChangeText={setNP}
                      />
                      <TextInput
                        style={[
                          styles.mInput,
                          {
                            backgroundColor: dark ? "#222" : "#f9f9f9",
                            color: txt,
                          },
                        ]}
                        placeholder="Confirm password"
                        placeholderTextColor={sub}
                        secureTextEntry
                        value={confirmPass}
                        onChangeText={setCP}
                      />
                      {resetError !== "" && (
                        <Text
                          style={[styles.err, { fontSize: 13 * fontScale }]}
                        >
                          {resetError}
                        </Text>
                      )}
                      <View style={styles.mRow}>
                        <Pressable
                          style={[styles.mBtn, { backgroundColor: "#ccc" }]}
                          onPress={closeModal}
                        >
                          <Text style={styles.mBtnTxt}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.mBtn, { backgroundColor: "#16a34a" }]}
                          onPress={handleSetNewPass}
                        >
                          <Text style={[styles.mBtnTxt, { color: "#fff" }]}>
                            Save
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  back: { position: "absolute", top: 50, left: 20 },
  title: { fontWeight: "bold" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    height: 48,
  },
  input: { flex: 1 },
  err: { color: "red", marginTop: 4 },
  loginBtn: {
    width: "100%",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  forgot: { textDecorationLine: "underline" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { width: "85%", borderRadius: 8, padding: 16 },
  mTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  mMsg: { fontSize: 14, marginBottom: 16 },
  mInput: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  mRow: { flexDirection: "row", justifyContent: "space-between" },
  mBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
  },
  mBtnTxt: { fontSize: 14 },
});

export default LoginScreen;
