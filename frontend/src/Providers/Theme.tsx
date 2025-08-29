import React, { createContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
interface ThemeProviderProps {
  children: ReactNode;
}

const defaultContextValue: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>((localStorage.getItem("theme") as Theme) || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme == "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
