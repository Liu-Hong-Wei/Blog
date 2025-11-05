import { Outlet } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import SuspenseErrorBoundary from "../components/SuspenseErrorBoundary.tsx";
import { PageLoadingSpinner } from "../components/Spinners.tsx";
import SiteHeader from "../components/SiteHeader.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import MobileDrawer from "../components/MobileDrawer.tsx";


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
