import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchTrending, searchStories } from "../api/News";
import ThemedView from "../components/ThemedView";
import { useTheme } from "../context/ThemeContext";

const categoryMap = {
  1: { label: "Environment", color: "#4ade80" },
  2: { label: "Human Rights", color: "#f87171" },
  3: { label: "Poverty", color: "#fb923c" },
  4: { label: "Health", color: "#34d399" },
  5: { label: "Education", color: "#60a5fa" },
  6: { label: "Politics", color: "#facc15" },
  7: { label: "Tech Ethics", color: "#38bdf8" },
  8: { label: "Peace", color: "#c084fc" },
  9: { label: "Culture", color: "#f472b6" },
};

const MainScreen = () => {
  const nav = useNavigation();
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = dark ? "#fff" : "#000";
  const muted = dark ? "#bbb" : "#666";
  const outline = dark ? "#444" : "#ccc";

  const [prefs, setPrefs] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const loadStories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTrending(prefs);
      setStories(data);
    } catch {
      setError("Can't load stories right now.");
    }
    setLoading(false);
  }, [prefs]);

  useEffect(() => {
    (async () => {
      const current = await AsyncStorage.getItem("current_user");
      const key = current ? current.toLowerCase() : "guest";
      const saved = await AsyncStorage.getItem(`prefs_${key}`);
      if (saved) setPrefs(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const onSearch = async () => {
    if (query.trim() === "") return;
    setLoading(true);
    setError("");
    try {
      const data = await searchStories(query.trim());
      setStories(data);
      setActive(null);
    } catch {
      setError("Search failed. Try again later.");
    }
    setLoading(false);
  };

  const saveStory = async (story) => {
    const current = await AsyncStorage.getItem("current_user");
    const key = current ? current.toLowerCase() : "guest";
    const raw = await AsyncStorage.getItem(`saved_${key}`);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.find((s) => s.id === story.id)) {
      await AsyncStorage.setItem(
        `saved_${key}`,
        JSON.stringify([...list, story])
      );
    }
  };

  const filtered =
    active || query
      ? stories.filter(
          (s) =>
            (!active || s.category === active) &&
            s.title.toLowerCase().includes(query.toLowerCase())
        )
      : stories;

  const colorFor = (cat) => categoryMap[cat]?.color || "#38bdf8";

  return (
    <ThemedView>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: bg }}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: card, borderColor: outline },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={muted} />
          <TextInput
            style={[
              styles.searchInput,
              { color: txt, fontSize: 14 * fontScale },
            ]}
            placeholder="Search an issue…"
            placeholderTextColor={muted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
        </View>
      </SafeAreaView>

      <View style={[styles.container, { backgroundColor: bg }]}>
        <FlatList
          data={prefs}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          keyExtractor={(i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                {
                  backgroundColor:
                    active === item ? categoryMap[item].color : bg,
                  borderColor: categoryMap[item].color,
                },
              ]}
              onPress={() => setActive(active === item ? null : item)}
            >
              <Text
                style={{
                  color: active === item ? "#fff" : categoryMap[item].color,
                  fontSize: 13 * fontScale,
                  fontWeight: "500",
                }}
              >
                {categoryMap[item].label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {loading && <ActivityIndicator style={{ marginTop: 40 }} />}

        {error !== "" && !loading && (
          <Text style={[styles.err, { fontSize: 15 * fontScale }]}>
            {error}
          </Text>
        )}

        {!loading && error === "" && (
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.card, { backgroundColor: card }]}
                onPress={() =>
                  nav.navigate("StoryDetail", {
                    story: item,
                    color: colorFor(item.category),
                  })
                }
              >
                <View style={styles.cardRow}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text
                      style={[
                        styles.cardTitle,
                        { color: txt, fontSize: 15 * fontScale },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.cardSummary,
                        {
                          color: dark ? "#aaa" : "#555",
                          fontSize: 13 * fontScale,
                        },
                      ]}
                    >
                      {item.summary}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      saveStory(item);
                    }}
                  >
                    <Ionicons name="bookmark-outline" size={22} color={txt} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 44,
    marginHorizontal: 16,
    marginTop: 8,
  },
  searchInput: { flex: 1, marginLeft: 6 },
  chip: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  cardSummary: {},
  err: { textAlign: "center", color: "#f87171", marginTop: 40 },
});

export default MainScreen;
