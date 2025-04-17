import React, { useState } from "react";
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

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [resetStep, setResetStep] = useState("email"); // 'email' or 'newpass'
  const [resetEmail, setResetEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [resetError, setResetError] = useState("");

  const attemptLogin = async () => {
    const stored = await AsyncStorage.getItem("blockwise_user");
    if (!stored) {
      setLoginError("No account found. Sign up first.");
      return;
    }
    const { email: storedMail, hash } = JSON.parse(stored);
    const hashTry = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    if (storedMail !== email.toLowerCase() || hashTry !== hash) {
      setLoginError("Incorrect email or password.");
      return;
    }
    setLoginError("");
    navigation.navigate("Categories");
  };

  const handleEmailNext = async () => {
    const stored = await AsyncStorage.getItem("blockwise_user");
    if (!stored) {
      setResetError("No account found.");
      return;
    }
    const { email: storedMail } = JSON.parse(stored);
    if (storedMail !== resetEmail.toLowerCase()) {
      setResetError("E‑mail does not match any account.");
      return;
    }
    setResetError("");
    setResetStep("newpass");
  };

  const handleSetNewPass = async () => {
    if (newPass.trim() === "" || confirmPass.trim() === "") {
      setResetError("All fields are required.");
      return;
    }
    if (newPass !== confirmPass) {
      setResetError("Passwords do not match.");
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
    setModalVisible(false);
    setResetStep("email");
    setResetEmail("");
    setNewPass("");
    setConfirmPass("");
    setResetError("");
  };

  const closeModal = () => {
    setModalVisible(false);
    setResetStep("email");
    setResetEmail("");
    setNewPass("");
    setConfirmPass("");
    setResetError("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flexContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>BlockWise</Text>

          <Ionicons
            name="school-outline"
            size={80}
            color="#333"
            style={styles.centerIcon}
          />

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {loginError !== "" && (
            <Text style={styles.errorText}>{loginError}</Text>
          )}

          <TouchableOpacity style={styles.loginButton} onPress={attemptLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {resetStep === "email" && (
                  <>
                    <Text style={styles.modalTitle}>Forgot your password?</Text>
                    <Text style={styles.modalMessage}>
                      Enter the e‑mail you signed up with and we’ll let you
                      create a new password.
                    </Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Email address"
                      placeholderTextColor="#999"
                      value={resetEmail}
                      onChangeText={setResetEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {resetError !== "" && (
                      <Text style={styles.errorText}>{resetError}</Text>
                    )}
                    <View style={styles.modalButtonRow}>
                      <Pressable
                        style={[
                          styles.modalButton,
                          { backgroundColor: "#ccc" },
                        ]}
                        onPress={closeModal}
                      >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.modalButton,
                          { backgroundColor: "#63c" },
                        ]}
                        onPress={handleEmailNext}
                      >
                        <Text
                          style={[styles.modalButtonText, { color: "#fff" }]}
                        >
                          Next
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}

                {resetStep === "newpass" && (
                  <>
                    <Text style={styles.modalTitle}>Set new password</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="New password"
                      placeholderTextColor="#999"
                      value={newPass}
                      onChangeText={setNewPass}
                      secureTextEntry
                    />
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Confirm password"
                      placeholderTextColor="#999"
                      value={confirmPass}
                      onChangeText={setConfirmPass}
                      secureTextEntry
                    />
                    {resetError !== "" && (
                      <Text style={styles.errorText}>{resetError}</Text>
                    )}
                    <View style={styles.modalButtonRow}>
                      <Pressable
                        style={[
                          styles.modalButton,
                          { backgroundColor: "#ccc" },
                        ]}
                        onPress={closeModal}
                      >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.modalButton,
                          { backgroundColor: "#16a34a" },
                        ]}
                        onPress={handleSetNewPass}
                      >
                        <Text
                          style={[styles.modalButtonText, { color: "#fff" }]}
                        >
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
  );
};

const styles = StyleSheet.create({
  flexContainer: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: "#E2F9DB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  goBackButton: { position: "absolute", top: 50, left: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 10 },
  centerIcon: { marginVertical: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    height: 48,
  },
  inputIcon: { marginRight: 6 },
  inputField: { flex: 1, color: "#333" },
  errorText: { color: "red", marginTop: 4 },
  loginButton: {
    width: "100%",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  forgotPasswordLink: { marginTop: 10 },
  forgotText: { color: "#222", textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  modalMessage: { fontSize: 14, marginBottom: 16, color: "#555" },
  modalInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    color: "#333",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: { fontSize: 14 },
});

export default LoginScreen;
