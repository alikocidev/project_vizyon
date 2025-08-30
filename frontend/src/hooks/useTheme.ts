import { useContext } from "react";
import { ThemeContext } from "@/providers/theme";

const useTheme = () => {
    return useContext(ThemeContext);
};

export default useTheme;
