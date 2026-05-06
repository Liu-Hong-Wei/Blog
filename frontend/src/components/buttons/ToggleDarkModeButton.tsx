import { motion } from 'motion/react';
import { useLayoutEffect, useState } from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';
import DarkModeIcon from '../icons/DarkModeIcon';
import LightModeIcon from '../icons/LightModeIcon';
import MonitorModeIcon from '../icons/MonitorModeIcon';

type Theme = 'dark' | 'light' | 'system';

function isSystemDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ReactNode;
}

const themes: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: <LightModeIcon /> },
  { value: 'system', label: 'System', icon: <MonitorModeIcon /> },
  { value: 'dark', label: 'Dark', icon: <DarkModeIcon /> },
];

export default function ToggleDarkModeButton() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const systemPrefersDark = isSystemDarkMode();
      const currentTheme = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

      if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const activeIndex = themes.findIndex(t => t.value === theme);

  return (
    <div className="relative inline-flex items-center rounded-full bg-bgsecondary/70 p-[2px] ring-1 ring-bgsecondary/50">
      {/* Sliding active background */}
      <motion.div
        className="absolute size-8 rounded-full bg-bgprimary shadow-sm"
        style={{ top: 2, left: 2 }}
        initial={false}
        animate={{ x: activeIndex * 30 }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 30,
        }}
      />

      {themes.map(({ value, label, icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleThemeChange(value)}
            title={label}
            aria-label={`Switch to ${label} mode`}
            aria-pressed={isActive}
            className={`relative z-10 flex size-8 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-bgsecondary ${
              isActive ? 'text-secondary' : 'text-primary/50 hover:text-primary/80'
            } ${!mounted ? 'opacity-0' : 'opacity-100'}`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
