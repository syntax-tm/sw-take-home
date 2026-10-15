"use client";

import { useEffect, useRef } from "react";

export const useKeySequence = (targetSequence: string[], callback: () => void, delay = 1000) => {
  // use refs to prevent unnecessary re-renders or effect re-runs
  const sequenceRef = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // clear previous expiration timer on every keystroke
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // standardize case or use direct strings matching event.key
      const pressedKey = event.key;

      // append the new key to our tracking buffer
      sequenceRef.current.push(pressedKey);

      // keep the buffer size matching only the target sequence length
      if (sequenceRef.current.length > targetSequence.length) {
        sequenceRef.current.shift();
      }

      // check if the current buffer exactly matches the target sequence
      const isMatch = targetSequence.every(
        (key, index) => key.toLowerCase() === sequenceRef.current[index]?.toLowerCase(),
      );

      if (isMatch) {
        console.log(`keysequencecomplete: ${callback.name}()`);
        callback();
        sequenceRef.current = []; // reset buffer on success
      } else {
        // automatically clear the buffer if the user stops typing
        timeoutRef.current = setTimeout(() => {
          sequenceRef.current = [];
        }, delay);
      }
    };

    // safely attach listener on the client side
    document.addEventListener("keydown", handleKeyDown);

    // clean up listeners and timers when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [targetSequence, callback, delay]);
};

export { useKeySequence as default };
