import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedView from "../components/ThemedView.js";
import { useTheme } from "../context/ThemeContext.js";

const categories = [
  { id: 1, label: "Environment & Climate", color: "#4ade80" },
  { id: 2, label: "Human Rights & Social Justice", color: "#f87171" },
  { id: 3, label: "Poverty & Economic Equity", color: "#fb923c" },
  { id: 4, label: "Health & Wellbeing", color: "#34d399" },
  { id: 5, label: "Education & Youth", color: "#60a5fa" },
  { id: 6, label: "Politics & Governance", color: "#facc15" },
  { id: 7, label: "Legal & Ethical Tech", color: "#38bdf8" },
  { id: 8, label: "Conflict & Peace", color: "#c084fc" },
  { id: 9, label: "Cultural & Community", color: "#f472b6" },
];

const CategoriesScreen = ({ navigation }) => {
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const txt = dark ? "#fff" : "#000";
  const sub = dark ? "#aaa" : "#333";

  const [selected, setSelected] = useState([]);
  const [userKey, setUserKey] = useState("guest");

  useEffect(() => {
    const load = async () => {
      const current = await AsyncStorage.getItem("current_user");
      const key = current ? current.toLowerCase() : "guest";
      setUserKey(key);
      const saved = await AsyncStorage.getItem(`prefs_${key}`);
      if (saved) setSelected(JSON.parse(saved));
    };
    load();
  }, []);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleGo = async () => {
    if (userKey !== "guest") {
      await AsyncStorage.setItem(`prefs_${userKey}`, JSON.stringify(selected));
    }
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  return (
    <ThemedView>
      <View style={[st.container, { backgroundColor: bg }]}>
        <TouchableOpacity style={st.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={txt} />
        </TouchableOpacity>

        <TouchableOpacity style={st.skip} onPress={handleGo}>
          <Text style={[st.skipTxt, { color: sub }]}>Skip</Text>
        </TouchableOpacity>

        <Ionicons name="school-outline" size={72} color={txt} style={st.logo} />

        <Text style={[st.heading, { color: txt, fontSize: 18 * fontScale }]}>
          Pick any topics that resonate with you
        </Text>

        {userKey !== "guest" && (
          <Text style={[st.note, { color: sub, fontSize: 12 * fontScale }]}>
            Already have an account? Press “Skip” to continue
          </Text>
        )}

        <FlatList
          data={categories}
          keyExtractor={(i) => i.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggle(item.id)}
              style={[
                st.card,
                {
                  backgroundColor: item.color,
                  opacity: selected.includes(item.id) ? 1 : 0.5,
                },
              ]}
            >
              <Text style={[st.cardTxt, { fontSize: 14 * fontScale }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={[st.goBtn, { opacity: selected.length ? 1 : 0.4 }]}
          disabled={!selected.length}
          onPress={handleGo}
        >
          <Text style={[st.goTxt, { fontSize: 16 * fontScale }]}>Go</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, alignItems: "center" },
  back: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  skip: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  skipTxt: { fontSize: 16 },
  logo: { marginTop: 100, marginBottom: 14 },
  heading: { fontWeight: "500", marginBottom: 4, textAlign: "center" },
  note: { marginBottom: 6, textAlign: "center" },
  card: {
    width: "48%",
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },
  cardTxt: { color: "#fff", textAlign: "center", fontWeight: "600" },
  goBtn: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  goTxt: { color: "#fff", fontWeight: "600" },
});

export default CategoriesScreen;
