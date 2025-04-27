import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext.js";

const SettingsScreen = () => {
  const nav = useNavigation();
  const { dark, fontScale, toggleDark, changeFont } = useTheme();
  const [isGuest, setIsGuest] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const check = async () => {
        const u = await AsyncStorage.getItem("current_user");
        setIsGuest(!u);
      };
      check();
    }, [])
  );

  const logoutOrHome = async () => {
    const u = await AsyncStorage.getItem("current_user");
    if (u) {
      await AsyncStorage.multiRemove([
        "current_user",
        `saved_${u.toLowerCase()}`,
      ]);
    }
    nav.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const clearSaved = async () => {
    const u = await AsyncStorage.getItem("current_user");
    const key = u ? u.toLowerCase() : "guest";
    await AsyncStorage.removeItem(`saved_${key}`);
    Alert.alert("Done", "Saved articles cleared");
  };

  const deleteAccount = async () => {
    const u = await AsyncStorage.getItem("current_user");
    if (!u) return;
    await AsyncStorage.multiRemove([
      "current_user",
      `prefs_${u.toLowerCase()}`,
      `saved_${u.toLowerCase()}`,
      "blockwise_user",
    ]);
    nav.reset({ index: 0, routes: [{ name: "Home" }] });
  };

  const confirmClear = () =>
    Alert.alert(
      "Clear Saved Articles",
      "Are you sure you want to delete all saved articles?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearSaved },
      ]
    );

  const confirmDelete = () =>
    Alert.alert(
      "Delete Account",
      "This will remove your account and all local data. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteAccount },
      ]
    );

  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = dark ? "#fff" : "#000";
  const sub = dark ? "#bbb" : "#555";

  const Row = ({ label, onPress, right }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      style={[st.row, { backgroundColor: card }]}
      onPress={onPress}
    >
      <Text style={[st.label, { color: txt, fontSize: 15 * fontScale }]}>
        {label}
      </Text>
      {right}
    </TouchableOpacity>
  );

  const Section = ({ title }) => (
    <Text style={[st.section, { color: sub, fontSize: 14 * fontScale }]}>
      {title}
    </Text>
  );

  return (
    <View style={[st.container, { backgroundColor: bg }]}>
      <Section title="Account" />
      {!isGuest ? (
        <>
          <Row
            label="Update Preferences"
            onPress={() => nav.navigate("Categories")}
          />
          <Row
            label="Change Password"
            onPress={() =>
              nav.reset({
                index: 0,
                routes: [
                  {
                    name: "Login",
                    params: { forgot: true, origin: "Settings" },
                  },
                ],
              })
            }
          />
          <Row label="Logout" onPress={logoutOrHome} />
        </>
      ) : (
        <Row label="Back to Home" onPress={logoutOrHome} />
      )}

      <Section title="Appearance" />
      <Row
        label="Dark Mode"
        right={<Switch value={dark} onValueChange={toggleDark} />}
      />
      <View style={[st.sliderRow, { backgroundColor: card }]}>
        <Text style={[st.sliderLab, { color: txt, fontSize: 15 * fontScale }]}>
          Font Size
        </Text>
        <Slider
          style={{ flex: 1 }}
          minimumValue={0.9}
          maximumValue={1.2}
          step={0.05}
          value={fontScale}
          onValueChange={changeFont}
          minimumTrackTintColor="#3b82f6"
        />
      </View>

      <Section title="Data & Privacy" />
      <Row label="Clear Saved Articles" onPress={confirmClear} />
      {!isGuest && <Row label="Delete Account" onPress={confirmDelete} />}

      <Section title="About" />
      <Row label="About & Licenses" onPress={() => nav.navigate("About")} />
      <Row label="Send Feedback" onPress={() => nav.navigate("Feedback")} />
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  section: { marginTop: 24, marginBottom: 6, fontWeight: "700" },
  row: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontWeight: "400" },
  sliderRow: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  sliderLab: { marginRight: 10 },
});

export default SettingsScreen;
