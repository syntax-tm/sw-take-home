'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_TOUCH_DELAY = 500;

export interface DoubleTapInput {
  onDoubleTap: () => void;
  delay?: number;
}

export const useDoubleTap = ({ onDoubleTap, delay = DEFAULT_TOUCH_DELAY }: DoubleTapInput) => {
  const prevTouchRef = useRef(0);

  useEffect(() => {

    if (typeof document === "undefined") return;

    const onTouchEnd = () => {
      const now = Date.now();
      if (now - prevTouchRef.current <= delay) {
        onDoubleTap();
      }
      prevTouchRef.current = now;
    };

    document.addEventListener("touchstart", onTouchEnd);
    return () => {
      document.removeEventListener("touchend", onTouchEnd);
    };

  }, [onDoubleTap, delay]);
};

export { useDoubleTap as default };
