'use client';

import { useState, useEffect } from 'react';

export const useActiveElement = () => {

  // initialize with the current active element, safe for SSR environments
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined' ? document.activeElement as HTMLElement : null,
  );
  const [isInput, setIsInput] = useState(false);

  useEffect(() => {
    // listener for focus changes
    const handleFocusIn = () => {
      const element = document.activeElement as HTMLElement;
      setActiveElement(element);
      const isInteractiveInput =
        element && (
          element.tagName === 'INPUT' ||
          element.tagName === 'TEXTAREA' ||
          element.tagName === 'SELECT' ||
          element.isContentEditable
        );
      setIsInput(isInteractiveInput);
    };

    // 'focusin' bubbles up, making it perfect for tracking page-wide focus changes
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return {
    activeElement,
    isInput,
  };
};

export { useActiveElement as default };
