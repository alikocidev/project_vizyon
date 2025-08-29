import { useContext } from "react";
import { ThemeContext } from "@/Providers/Theme";

const useTheme = () => {
    return useContext(ThemeContext);
};

export default useTheme;
