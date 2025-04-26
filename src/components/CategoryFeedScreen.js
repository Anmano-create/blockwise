import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ThemedView from "./ThemedView";
import { useTheme } from "../context/ThemeContext";

const mock = [
  {
    id: 1,
    title: "River cleanup project announced",
    summary: "Local initiative to restore waterways.",
  },
  {
    id: 2,
    title: "New solar farms approved",
    summary: "Government green-lights large projects.",
  },
];

const CategoryFeedScreen = ({ route }) => {
  const { id, label, color } = route.params;
  const nav = useNavigation();
  const { dark, fontScale } = useTheme();
  const txt = { color: dark ? "#fff" : "#000", fontSize: 16 * fontScale };
  const cardBg = dark ? "#1e1e1e" : "#fff";

  return (
    <ThemedView>
      <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
        <Ionicons name="arrow-back" size={24} color={txt.color} />
      </TouchableOpacity>

      <Text style={[styles.head, txt]}>{label}</Text>

      <FlatList
        data={mock.map((m) => ({ ...m, category: id }))}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: cardBg }]}
            onPress={() => nav.navigate("StoryDetail", { story: item, color })}
          >
            <Text style={[txt, { fontSize: 15 * fontScale }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  head: {
    marginTop: 100,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "700",
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    padding: 16,
  },
});

export default CategoryFeedScreen;
