import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "./ThemedView.js";
import { useTheme } from "../context/ThemeContext.js";

const FeedbackScreen = ({ navigation }) => {
  const { dark, fontScale } = useTheme();
  const [msg, setMsg] = useState("");
  const txt = { color: dark ? "#fff" : "#000" };

  const send = () => {
    if (!msg.trim()) return;
    Alert.alert("Thank you", "Feedback sent");
    navigation.goBack();
  };

  return (
    <ThemedView>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={txt.color} />
      </TouchableOpacity>
      <View style={styles.pad}>
        <Text style={[styles.head, txt, { fontSize: 20 * fontScale }]}>
          Send Feedback
        </Text>
        <TextInput
          style={[
            styles.box,
            { backgroundColor: dark ? "#1e1e1e" : "#fff", color: txt.color },
          ]}
          multiline
          value={msg}
          onChangeText={setMsg}
        />
        <TouchableOpacity style={styles.btn} onPress={send}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 20 },
  pad: { flex: 1, padding: 20, paddingTop: 100 },
  head: { fontWeight: "700", marginBottom: 10 },
  box: { borderRadius: 8, height: 160, padding: 12, textAlignVertical: "top" },
  btn: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
});

export default FeedbackScreen;
