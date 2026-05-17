import { useEffect, useState } from 'react';

export default function useLiveTime(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Align first tick to the next whole minute so the clock looks alive.
    const msToNextTick = intervalMs - (Date.now() % intervalMs);
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      setNow(new Date());
      intervalId = window.setInterval(() => setNow(new Date()), intervalMs);
    }, msToNextTick);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [intervalMs]);

  return now;
}
