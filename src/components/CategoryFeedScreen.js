import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchTrending } from "../api/News";
import ThemedView from "./ThemedView";
import { useTheme } from "../context/ThemeContext";

const CategoryFeedScreen = ({ route }) => {
  const { id, label, color } = route.params;
  const nav = useNavigation();
  const { dark, fontScale } = useTheme();
  const txt = { color: dark ? "#fff" : "#000", fontSize: 16 * fontScale };
  const cardBg = dark ? "#1e1e1e" : "#fff";

  const [page, setPage] = useState(1);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTrending([id], nextPage);
        setStories(data);
        setPage(nextPage);
      } catch {
        setError("Can't load stories right now.");
      }
      setLoading(false);
    },
    [id]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const refresh = () => load(page + 1); // page+1 guarantees a fresh slice

  return (
    <ThemedView>
      <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
        <Ionicons name="arrow-back" size={24} color={txt.color} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.refresh} onPress={refresh}>
        <Ionicons name="refresh" size={24} color={txt.color} />
      </TouchableOpacity>

      <Text style={[styles.head, txt]}>{label}</Text>

      {loading && <ActivityIndicator style={{ marginTop: 40 }} />}

      {error !== "" && !loading && (
        <Text style={[styles.err, { fontSize: 15 * fontScale }]}>{error}</Text>
      )}

      {!loading && error === "" && (
        <FlatList
          data={stories}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: cardBg }]}
              onPress={() =>
                nav.navigate("StoryDetail", { story: item, color })
              }
            >
              <Text style={[txt, { fontSize: 15 * fontScale }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  refresh: { position: "absolute", top: 50, right: 20, zIndex: 10 },
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
  err: { textAlign: "center", color: "#f87171", marginTop: 40 },
});

export default CategoryFeedScreen;
