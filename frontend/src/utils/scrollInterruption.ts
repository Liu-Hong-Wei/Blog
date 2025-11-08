const INTERRUPT_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
];

// Provide a shared way to stop automated scroll animations when users interact.
export function addScrollInterruptionListeners(cancel: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleWheel = () => cancel();
  const handleTouchStart = () => cancel();
  const handleKeyDown = (event: KeyboardEvent) => {
    if (INTERRUPT_KEYS.includes(event.key)) {
      cancel();
    }
  };

  window.addEventListener('wheel', handleWheel, { passive: true });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('keydown', handleKeyDown);
  };
}
