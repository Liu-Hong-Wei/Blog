import { useEffect, useRef } from "react";

// Lock or unlock body scroll based on the `locked` parameter
export default function useBodyScrollLock(locked: boolean) {
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