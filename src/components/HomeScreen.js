import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../components/ThemedView.js";
import { useTheme } from "../context/ThemeContext.js";

const HomeScreen = ({ navigation }) => {
  const { dark, fontScale } = useTheme();
  const bg = dark ? "#121212" : "#E2F9DB";
  const card = dark ? "#1e1e1e" : "#fff";
  const txt = dark ? "#fff" : "#000";
  const sub = dark ? "#aaa" : "#333";

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -60,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  return (
    <ThemedView>
      <View style={[st.container, { backgroundColor: bg }]}>
        <Animated.View
          style={[st.titleWrap, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={[st.title, { color: txt, fontSize: 28 * fontScale }]}>
            Welcome to BlockWise!
          </Text>
        </Animated.View>

        <Ionicons name="school-outline" size={80} color={txt} style={st.icon} />

        <Animated.Text
          style={[
            st.sub,
            { color: sub, opacity: fadeAnim, fontSize: 16 * fontScale },
          ]}
        >
          Choose an option to continue
        </Animated.Text>

        <View style={st.btnWrap}>
          <TouchableOpacity
            style={[st.btn, { backgroundColor: card }]}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="log-in-outline" size={20} color={txt} />
            <Text style={[st.btnTxt, { color: txt, fontSize: 16 * fontScale }]}>
              Log In
            </Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity
              style={[st.btn, { backgroundColor: card }]}
              onPress={() => navigation.navigate("Signup")}
            >
              <Ionicons name="person-add-outline" size={20} color={txt} />
              <Text
                style={[st.btnTxt, { color: txt, fontSize: 16 * fontScale }]}
              >
                Create Account
              </Text>
              <TouchableOpacity
                onPress={() => setInfoVisible(!infoVisible)}
                style={st.infoBtn}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={sub}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {infoVisible && (
              <View style={[st.infoBox, { backgroundColor: card }]}>
                <Text
                  style={[st.infoTxt, { color: txt, fontSize: 14 * fontScale }]}
                >
                  By creating an account, you can save your preferences, earn
                  more points for reading about issues and access more features!
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[st.btn, { backgroundColor: card }]}
            onPress={() => navigation.navigate("Categories")}
          >
            <Ionicons name="walk-outline" size={20} color={txt} />
            <Text style={[st.btnTxt, { color: txt, fontSize: 16 * fontScale }]}>
              Continue as guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  titleWrap: {},
  title: { fontWeight: "bold", marginBottom: 4 },
  icon: { marginVertical: 20 },
  sub: { marginBottom: 40 },
  btnWrap: { width: "80%" },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  btnTxt: { marginLeft: 8 },
  infoBtn: { marginLeft: "auto" },
  infoBox: {
    marginTop: 4,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#666",
  },
  infoTxt: { lineHeight: 18 },
});

export default HomeScreen;
