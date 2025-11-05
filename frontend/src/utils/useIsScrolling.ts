import { useEffect, useRef, useState } from "react";

type ScrollState = {
  isScrolling: boolean;
  isAtTop: boolean;
  hasScrolled: boolean;
  scrollDirection: "up" | "down" | "idle";
  isScrollingUp: boolean;
  isScrollingDown: boolean;
};

const SCROLL_IDLE_DELAY = 300;

const useIsScrolling = (): ScrollState => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "idle">("idle");
  const timeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;

      setIsAtTop(currentScrollY <= 0);
      setIsScrolling(delta !== 0);

      if (delta < 0) {
        setScrollDirection("up");
      } else if (delta > 0) {
        setScrollDirection("down");
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection("idle");
      }, SCROLL_IDLE_DELAY);

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isScrolling,
    isAtTop,
    hasScrolled: !isAtTop,
    scrollDirection,
    isScrollingUp: scrollDirection === "up",
    isScrollingDown: scrollDirection === "down"
  };
};

export default useIsScrolling;