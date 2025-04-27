import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { fetchTrending } from "../api/News";
import ThemedView from "./ThemedView";
import { useTheme } from "../context/ThemeContext";

const grid = [
  { id: 1, label: "Environment", color: "#4ade80" },
  { id: 2, label: "Human Rights", color: "#f87171" },
  { id: 3, label: "Poverty", color: "#fb923c" },
  { id: 4, label: "Health", color: "#34d399" },
  { id: 5, label: "Education", color: "#60a5fa" },
  { id: 6, label: "Politics", color: "#facc15" },
  { id: 7, label: "Tech Ethics", color: "#38bdf8" },
  { id: 8, label: "Peace", color: "#c084fc" },
  { id: 9, label: "Culture", color: "#f472b6" },
];

const w = Dimensions.get("window").width;

const ExploreScreen = () => {
  const nav = useNavigation();
  const { dark, fontScale } = useTheme();
  const txt = { color: dark ? "#fff" : "#000", fontSize: 15 * fontScale };

  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTrending([]);
        setBanner(data.slice(0, 5));
      } catch {
        setError("Can't load stories right now.");
      }
      setLoading(false);
    };
    run();
  }, []);

  const colorFor = (cat) => grid.find((g) => g.id === cat)?.color || "#34d399";

  return (
    <ThemedView>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        {loading && <ActivityIndicator style={{ marginTop: 30 }} />}

        {error !== "" && !loading && (
          <Text style={[styles.err, { fontSize: 15 * fontScale }]}>
            {error}
          </Text>
        )}

        {!loading && error === "" && (
          <FlatList
            data={banner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.banner,
                  {
                    backgroundColor: colorFor(item.category),
                    width: w - 32,
                  },
                ]}
              >
                <Text style={[styles.bannerTxt, { fontSize: 18 * fontScale }]}>
                  {item.title}
                </Text>
              </View>
            )}
          />
        )}

        <FlatList
          data={grid}
          numColumns={3}
          keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tile, { borderColor: item.color }]}
              onPress={() =>
                nav.navigate("CategoryFeed", {
                  id: item.id,
                  label: item.label,
                  color: item.color,
                })
              }
            >
              <Text style={txt}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 16 },
  banner: {
    borderRadius: 12,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bannerTxt: { color: "#fff", fontWeight: "700" },
  tile: {
    flex: 1,
    margin: 6,
    borderWidth: 2,
    borderRadius: 10,
    height: 92,
    justifyContent: "center",
    alignItems: "center",
  },
  err: { textAlign: "center", color: "#f87171", marginTop: 40 },
});

export default ExploreScreen;
