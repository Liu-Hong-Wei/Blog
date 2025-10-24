import { useEffect } from "react";
import DarkModeIcon from "../icons/DarkModeIcon";
import LightModeIcon from "../icons/LightModeIcon";
import Button from "./Button";
import useLocalStorage from "../../hooks/useLocalStorage";

function isSystemDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true; // System is set to dark mode
  } else {
    return false; // System is not set to dark mode (or prefers light mode)
  }
}

export default function ToggleDarkModeButton({ className = "" }: { className?: string }) {
    const systemPrefersDark = isSystemDarkMode();
    const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme", systemPrefersDark ? "dark" : "light");

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    const newMode = theme === "dark" ? "light" : "dark";
    const handleClick = () => {
        setTheme(newMode);
    };
    const icon = theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />;
    return (
        <Button
            className={`flex justify-center items-center${className}`}
            variant="primary"
            onClick={handleClick}
            aria-label={`Change to ${newMode} Mode`}
        >
            {icon}
        </Button>
    );
}
