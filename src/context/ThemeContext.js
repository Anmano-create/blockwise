import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const load = async () => {
      const d = await AsyncStorage.getItem("theme_dark");
      const f = await AsyncStorage.getItem("font_scale");
      if (d !== null) setDark(d === "true");
      if (f !== null) setFontScale(parseFloat(f));
    };
    load();
  }, []);

  const toggleDark = async () => {
    const next = !dark;
    setDark(next);
    await AsyncStorage.setItem("theme_dark", next.toString());
  };

  const changeFont = async (v) => {
    setFontScale(v);
    await AsyncStorage.setItem("font_scale", v.toString());
  };

  return (
    <ThemeContext.Provider value={{ dark, fontScale, toggleDark, changeFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
