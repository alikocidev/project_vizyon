import { useContext } from "react";
import { ThemeContext } from "@/providers/Theme";

const useTheme = () => {
    return useContext(ThemeContext);
};

export default useTheme;
