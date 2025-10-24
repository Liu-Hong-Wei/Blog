import { useEffect, useState, useMemo } from "react";
import DarkModeIcon from "../icons/DarkModeIcon";
import LightModeIcon from "../icons/LightModeIcon";
import Button from "./Button";
import useLocalStorage from "../../hooks/useLocalStorage";
import MonitorModeIcon from "../icons/MonitorModeIcon";

type Theme = "dark" | "light" | "system";

function isSystemDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const themeIcons: Record<Theme, React.ReactNode> = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
    system: <MonitorModeIcon />,
};

export default function ToggleDarkModeButton() {
    const [theme, setTheme] = useLocalStorage<Theme>("theme", "system");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const applyTheme = () => {
            const systemPrefersDark = isSystemDarkMode();
            const currentTheme = theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

            if (currentTheme === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        applyTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === "system") {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [theme]);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
    };

    const orderedThemes = useMemo<Theme[]>(() => {
        const theOtherTheme: Theme = theme === "system" ? "dark" : theme === "light" ? "dark" : "light";
        const firstTheme: Theme = theme === "system" ? "light" : theme === "light" ? "light" : "dark";
        return [firstTheme, "system", theOtherTheme];
    }, [theme]);

    const getCurrentIcon = () => {
        if (theme === 'dark') return <DarkModeIcon />;
        if (theme === 'light') return <LightModeIcon />;
        return <MonitorModeIcon />;
    };

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex items-center space-x-1 rounded-full p-1 transition-all duration-500 ease-in-out ${isHovered ? 'max-w-xs' : 'max-w-[44px]'} overflow-hidden`}>
                {isHovered ? (
                    orderedThemes.map((mode, index) => (
                        <Button
                            key={mode}
                            variant={theme === mode ? 'secondary' : 'primary'}
                            onClick={() => handleThemeChange(mode)}
                            aria-label={`Change to ${mode} Mode`}
                            className={`rounded-full transition-opacity duration-500 ease-in-out`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {themeIcons[mode]}
                        </Button>
                    ))
                ) : (
                    <Button variant="primary" aria-label={`Current theme: ${theme}`} className="rounded-full">
                        {getCurrentIcon()}
                    </Button>
                )}
            </div>
        </div>
    );
}
