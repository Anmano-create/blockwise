import React from "react";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext.js";

const ThemedView = ({ style, children }) => {
  const { dark } = useTheme();
  return (
    <View
      style={[
        { flex: 1, backgroundColor: dark ? "#121212" : "#E2F9DB" },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ThemedView;
