import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedView from "./ThemedView";
import { useTheme } from "../context/ThemeContext";

const SavedScreen = () => {
  const nav = useNavigation();
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = dark ? "#fff" : "#000";
  const sub = dark ? "#888" : "#555";

  const [saved, setSaved] = useState([]);
  const [refreshing, setRef] = useState(false);

  const loadSaved = async () => {
    const current = await AsyncStorage.getItem("current_user");
    const key = current ? current.toLowerCase() : "guest";
    const raw = await AsyncStorage.getItem(`saved_${key}`);
    setSaved(raw ? JSON.parse(raw) : []);
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  const onRefresh = async () => {
    setRef(true);
    await loadSaved();
    setRef(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: card }]}
      onPress={() =>
        nav.navigate("StoryDetail", { story: item, color: "#38bdf8" })
      }
    >
      <Text style={[styles.title, { color: txt, fontSize: 15 * fontScale }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView>
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: bg }}>
        {saved.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text
              style={[
                styles.emptyTxt,
                { color: sub, fontSize: 15 * fontScale },
              ]}
            >
              No saved articles yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={saved}
            keyExtractor={(i) => i.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.pad}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  pad: { padding: 16 },
  card: { padding: 16, borderRadius: 10, marginVertical: 6 },
  title: { fontWeight: "500" },
  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTxt: { textAlign: "center" },
});

export default SavedScreen;
