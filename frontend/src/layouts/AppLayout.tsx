import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";

import MobileDrawer from "../components/MobileDrawer.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import SiteHeader from "../components/SiteHeader.tsx";
import { PageLoadingSpinner } from "../components/Spinners.tsx";
import SuspenseErrorBoundary from "../components/SuspenseErrorBoundary.tsx";
import useBodyScrollLock from "../utils/useBodyScrollLock.ts";


const DRAWER_DISMISS_DELAY = 300;

// Manage drawer visibility and active state with transition delays
function useDrawerTransition(isOpen: boolean, delayMs = DRAWER_DISMISS_DELAY) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const activationTimer = window.setTimeout(() => setActive(true), delayMs/6);
      return () => window.clearTimeout(activationTimer);
    }

    setActive(false);
    const dismissalTimer = window.setTimeout(() => setVisible(false), delayMs);
    return () => window.clearTimeout(dismissalTimer);
  }, [isOpen, delayMs]);

  return { visible, active };
}

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { visible: drawerVisible, active: drawerActive } = useDrawerTransition(drawerOpen);

  useBodyScrollLock(drawerVisible);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close drawer on Escape key press
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
    <div className="flex min-h-screen max-w-screen p-[0.05px] flex-col bg-bgprimary text-primary util-transition-colors">
      <SiteHeader onOpenDrawer={openDrawer} isDrawerOpen={drawerOpen} />
      <MobileDrawer visible={drawerVisible} active={drawerActive} onClose={closeDrawer} />
      <main className="flex grow flex-col util-transition-colors" role="main">
        <SuspenseErrorBoundary fallback={<PageLoadingSpinner />}>
          <Outlet />
        </SuspenseErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  );
}

export default AppLayout;
