import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedView from "./ThemedView";
import { useTheme } from "../context/ThemeContext";

const StoryDetailScreen = ({ route, navigation }) => {
  const { story, color } = route.params;
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = { color: dark ? "#fff" : "#000" };
  const sub = dark ? "#aaa" : "#555";
  const [saving, setSaving] = useState(false);

  const saveStory = async () => {
    if (saving) return;
    setSaving(true);
    const current = await AsyncStorage.getItem("current_user");
    const key = current ? current.toLowerCase() : "guest";
    const raw = await AsyncStorage.getItem(`saved_${key}`);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.find((s) => s.id === story.id)) {
      await AsyncStorage.setItem(
        `saved_${key}`,
        JSON.stringify([...list, story])
      );
      Alert.alert("Saved", "Article added to Saved list");
    } else {
      Alert.alert("Already saved");
    }
    setSaving(false);
  };

  return (
    <ThemedView style={{ backgroundColor: bg }}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={txt.color} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={[styles.title, txt, { fontSize: 22 * fontScale }]}>
          {story.title}
        </Text>
        <View style={[styles.tag, { backgroundColor: color }]}>
          <Text style={{ color: "#fff" }}>Category {story.category}</Text>
        </View>
        <Text style={[styles.body, { color: sub, fontSize: 15 * fontScale }]}>
          {story.summary ?? "Placeholder story body text…"}
        </Text>

        <TouchableOpacity
          style={[styles.save, { backgroundColor: color }]}
          onPress={saveStory}
        >
          <Ionicons name="bookmark-outline" size={20} color="#fff" />
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  pad: { paddingTop: 100, paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontWeight: "700", marginBottom: 6 },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  body: { lineHeight: 22, marginBottom: 20 },
  save: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 14,
  },
  saveTxt: { color: "#fff", marginLeft: 6, fontWeight: "600" },
});

export default StoryDetailScreen;
