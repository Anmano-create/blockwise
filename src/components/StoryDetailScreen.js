import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFullStory } from "../api/News";
import ThemedView from "./ThemedView";
import { useTheme } from "../context/ThemeContext";
import { OPENAI_KEY } from "../../env";

const links = {
  1: [
    { label: "WWF", url: "https://www.worldwildlife.org" },
    { label: "Greenpeace", url: "https://www.greenpeace.org" },
  ],
  2: [
    { label: "Amnesty International", url: "https://www.amnesty.org" },
    { label: "Human Rights Watch", url: "https://www.hrw.org" },
  ],
  3: [
    { label: "Oxfam", url: "https://www.oxfam.org" },
    { label: "GiveDirectly", url: "https://www.givedirectly.org" },
  ],
  4: [
    { label: "WHO", url: "https://www.who.int" },
    { label: "Doctors Without Borders", url: "https://www.msf.org" },
  ],
  5: [
    { label: "UNICEF", url: "https://www.unicef.org" },
    { label: "Room to Read", url: "https://www.roomtoread.org" },
  ],
  6: [{ label: "UNDP", url: "https://www.undp.org" }],
  7: [{ label: "EFF", url: "https://www.eff.org" }],
  8: [{ label: "ICRC", url: "https://www.icrc.org" }],
  9: [{ label: "UNESCO", url: "https://www.unesco.org" }],
};

const tidy = (t = "") =>
  t
    .replace(/<script[^>]*>[^]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[^]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const askOpenAI = async (raw) => {
  const prompt =
    "Summarise the following news article in ONE clear paragraph (max 80 words) so a 12-year-old can understand. Avoid jargon.:\n\n" +
    raw.slice(0, 6000);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.7,
    }),
  });
  const json = await res.json();
  if (json.choices?.[0]?.message?.content)
    return json.choices[0].message.content.trim();
  throw new Error("no summary");
};

const StoryDetailScreen = ({ route, navigation }) => {
  const { story, color } = route.params;
  const { dark, fontScale } = useTheme();

  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const sub = dark ? "#aaa" : "#555";

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { html } = await getFullStory(story.url);
        const plain = tidy(html);
        const nice = await askOpenAI(plain);
        setSummary(nice);
      } catch {
        setSummary(story.summary || "No summary available.");
      }
      setLoading(false);
    })();
  }, [story.url]);

  useEffect(() => {
    (async () => {
      const current = await AsyncStorage.getItem("current_user");
      const key = current ? current.toLowerCase() : "guest";
      const raw = await AsyncStorage.getItem(`saved_${key}`);
      const list = raw ? JSON.parse(raw) : [];
      setSaved(list.some((s) => s.id === story.id));
    })();
  }, [story.id]);

  const toggleSave = async () => {
    if (busy) return;
    setBusy(true);
    const current = await AsyncStorage.getItem("current_user");
    const key = current ? current.toLowerCase() : "guest";
    const raw = await AsyncStorage.getItem(`saved_${key}`);
    const list = raw ? JSON.parse(raw) : [];
    if (saved) {
      await AsyncStorage.setItem(
        `saved_${key}`,
        JSON.stringify(list.filter((s) => s.id !== story.id))
      );
      setSaved(false);
    } else {
      if (!list.find((s) => s.id === story.id)) {
        await AsyncStorage.setItem(
          `saved_${key}`,
          JSON.stringify([...list, story])
        );
      }
      setSaved(true);
    }
    setBusy(false);
  };

  const openUrl = (u) =>
    Linking.openURL(u).catch(() =>
      Alert.alert("Error", "Couldn't open the link")
    );

  return (
    <ThemedView style={{ backgroundColor: bg }}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={dark ? "#fff" : "#000"} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.pad}>
        <Text
          style={[
            styles.title,
            { color: dark ? "#fff" : "#000", fontSize: 22 * fontScale },
          ]}
        >
          {story.title}
        </Text>

        <View style={[styles.tag, { backgroundColor: color }]}>
          <Text style={{ color: "#fff" }}>Category {story.category}</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginVertical: 30 }} />
        ) : (
          <Text
            style={[
              styles.body,
              { color: sub, fontSize: 15 * fontScale, backgroundColor: card },
            ]}
          >
            {summary}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: color }]}
          onPress={toggleSave}
          disabled={busy}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={20}
            color="#fff"
          />
          <Text style={styles.saveTxt}>{saved ? "Unsave" : "Save"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={`src-${story.id}`}
          style={[styles.linkBtn, { borderColor: color }]}
          onPress={() => openUrl(story.url)}
        >
          <Ionicons name="open-outline" size={18} color={color} />
          <Text style={[styles.linkTxt, { color }]}>Read original</Text>
        </TouchableOpacity>

        {links[story.category]?.map((l, i) => (
          <TouchableOpacity
            key={l.url + i}
            style={[styles.linkBtn, { borderColor: color }]}
            onPress={() => openUrl(l.url)}
          >
            <Ionicons name="heart-outline" size={18} color={color} />
            <Text style={[styles.linkTxt, { color }]}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  pad: { paddingTop: 100, paddingHorizontal: 20, paddingBottom: 60 },
  title: { fontWeight: "700", marginBottom: 10 },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  body: {
    lineHeight: 22,
    padding: 14,
    borderRadius: 8,
    marginBottom: 24,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 14,
  },
  saveTxt: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    marginBottom: 10,
  },
  linkTxt: { marginLeft: 6, fontWeight: "600" },
});

export default StoryDetailScreen;
