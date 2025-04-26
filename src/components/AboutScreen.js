import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext.js";

const AboutScreen = ({ navigation }) => {
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const txt = dark ? "#fff" : "#000";

  return (
    <View style={[st.c, { backgroundColor: bg }]}>
      <TouchableOpacity style={st.b} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={txt} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingVertical: 60 }}>
        <Text style={[st.t, { color: txt, fontSize: 22 * fontScale }]}>
          About & Licenses
        </Text>
        <Text style={[st.body, { color: txt, fontSize: 14 * fontScale }]}>
          BlockWise v1.0.0{"\n\n"}
          This project uses React Native, Expo, AsyncStorage and other
          MIT-licensed libraries.
        </Text>
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  c: { flex: 1, paddingHorizontal: 20 },
  b: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  t: { fontWeight: "700", textAlign: "center", marginBottom: 12 },
  body: { lineHeight: 20 },
});

export default AboutScreen;
