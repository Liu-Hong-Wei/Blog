import { NavLink, Outlet } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import NavButton from "../components/buttons/NavButton";
import ToggleDarkModeButton from "../components/buttons/ToggleDarkModeButton.tsx";
import HamburgerIcon from "../components/icons/HamburgerIcon";
import SuspenseErrorBoundary from "../components/SuspenseErrorBoundary.tsx";
import { PageLoadingSpinner } from "../components/Spinners.tsx";

const NAV_LINKS = [
  { to: "/posts", label: "Posts" },
  { to: "/ideas", label: "Ideas" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" }
] as const;

const DRAWER_DISMISS_DELAY = 300;

// Manage drawer visibility and active state with transition delays
function useDrawerTransition(isOpen: boolean, delayMs = DRAWER_DISMISS_DELAY) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const activationTimer = window.setTimeout(() => setActive(true), 16);
      return () => window.clearTimeout(activationTimer);
    }

    setActive(false);
    const dismissalTimer = window.setTimeout(() => setVisible(false), delayMs);
    return () => window.clearTimeout(dismissalTimer);
  }, [isOpen, delayMs]);

  return { visible, active };
}

// Lock or unlock body scroll based on the `locked` parameter
function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const body = document.body as HTMLBodyElement;

    if (locked) {
      scrollYRef.current = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";

      return () => {
        const top = body.style.top;
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflow = "";

        if (top) {
          const y = Math.abs(parseInt(top, 10)) || 0;
          window.scrollTo(0, y);
        }
      };
    }

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
  }, [locked]);
}

type NavLinksProps = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
};

function NavLinks({ orientation = "horizontal", onNavigate, className = "" }: NavLinksProps) {
  const layoutClasses =
    orientation === "horizontal"
      ? "flex-row items-center gap-4"
      : "flex-col items-stretch gap-2";
  const buttonClasses =
    orientation === "horizontal"
      ? "justify-center px-2 py-1"
      : "w-full justify-start px-4 py-2 text-left";

  return (
    <ul
      className={`flex text-2xl ${layoutClasses} ${className}`}
      role="menubar"
      aria-orientation={orientation}
    >
      {NAV_LINKS.map(({ to, label }) => (
        <li key={to} role="menuitem">
          <NavButton to={to} onClick={onNavigate} ariaLabel={`${label} link`} className={buttonClasses}>
            {label}
          </NavButton>
        </li>
      ))}
    </ul>
  );
}

type SiteHeaderProps = {
  onOpenDrawer: () => void;
  isDrawerOpen: boolean;
};

function SiteHeader({ onOpenDrawer, isDrawerOpen }: SiteHeaderProps) {
  return (
    <header role="banner" className="sticky top-2 z-50 my-2 mx-4 flex justify-center md:mx-auto md:min-w-3xl">
      <nav
        className="flex h-12 w-full max-w-full items-center justify-between rounded-xl bg-bgprimary/70 px-4 backdrop-blur-xl shadow-sm shadow-bgsecondary ring-1 ring-bgsecondary transition-all duration-300"
        aria-label="Primary navigation"
      >
        <NavLink className="text-2xl font-bold" to="/">
          Ethan&apos;s Blog
        </NavLink>
        <div className="flex items-center">
          <NavLinks className="hidden md:flex" />
          <NavButton
            onClick={onOpenDrawer}
            className="ml-2 md:hidden"
            ariaLabel="Open navigation menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-navigation"
          >
            <HamburgerIcon />
          </NavButton>
        </div>
      </nav>
    </header>
  );
}

type MobileDrawerProps = {
  visible: boolean;
  active: boolean;
  onClose: () => void;
};

function MobileDrawer({ visible, active, onClose }: MobileDrawerProps) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-bgprimary/10 backdrop-blur-3xl transition-opacity duration-300 ${
          active ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        id="mobile-navigation"
        className={`fixed top-0 z-50 w-full rounded-b-xl bg-bgprimary/50 backdrop-blur-2xl shadow-md transition-transform duration-300 ${
          active ? "translate-y-0" : "-translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-12 items-center justify-center text-secondary">
          <NavLink to="/" className="text-2xl font-bold" onClick={onClose}>
            Ethan&apos;s Blog
          </NavLink>
        </div>
        <NavLinks orientation="vertical" className="px-6 pb-6" onNavigate={onClose} />
      </aside>
    </>
  );
}

function SiteFooter() {
  return (
    <footer
      className="mx-4 flex h-16 max-w-full items-center justify-between border-t-2 border-bgsecondary px-4 text-md text-primary transition-all duration-300 md:mx-auto md:min-w-3xl"
      role="contentinfo"
    >
      <div>© {new Date().getFullYear()} Ethan&apos;s Blog. All rights reserved.</div>
      <ToggleDarkModeButton />
    </footer>
  );
}

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { visible: drawerVisible, active: drawerActive } = useDrawerTransition(drawerOpen);

  useBodyScrollLock(drawerVisible);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="flex min-h-screen max-w-screen flex-col bg-bgprimary p-[0.05px] text-primary transition-colors duration-300">
      <SiteHeader onOpenDrawer={openDrawer} isDrawerOpen={drawerOpen} />
      <MobileDrawer visible={drawerVisible} active={drawerActive} onClose={closeDrawer} />
      <main className="flex grow flex-col bg-bgprimary transition-colors duration-300" role="main">
        <SuspenseErrorBoundary fallback={<PageLoadingSpinner />}>
          <Outlet />
        </SuspenseErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  );
}

export default AppLayout;
