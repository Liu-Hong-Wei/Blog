import { useState, useEffect } from "react";
import DarkModeIcon from "../icons/DarkModeIcon";
import LightModeIcon from "../icons/LightModeIcon";
import Button from "./Button";

// function isSystemDarkMode() {
//   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//     return true; // System is set to dark mode
//   } else {
//     return false; // System is not set to dark mode (or prefers light mode)
//   }
// }

export default function ToggleDarkModeButton({ className = "" }: { className?: string }) {
    const [theme, setTheme] = useState<"dark" | "light" | null>(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = storedTheme ? storedTheme as "dark" | "light" : (systemPrefersDark ? "dark" : "light");
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme) {
            const root = document.documentElement;
            if (theme === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    const handleClick = () => {
        setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
    };

    if (theme === null) {
        return null; // Or a placeholder
    }

    const newMode = theme === "dark" ? "light" : "dark";
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
