"use client";

import { useCallback, useEffect, useRef } from "react";
import usePath from "./usePath";

const MIN_SWIPE_DISTANCE = 50;

export interface SwipeInput {
  minDistance?: number;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enabledOnModal: boolean;
}

export const useSwipe = ({ minDistance = MIN_SWIPE_DISTANCE, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, enabledOnModal }: SwipeInput) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const { modal } = usePath();

  const reset = useCallback(() => {
    touchStartX.current = 0;
    touchEndX.current = 0;
    touchStartY.current = 0;
    touchEndY.current = 0;
  }, []);

  const onTouchStart = useCallback((e: TouchEvent) => {
    // ignore multiple touches (pinch zoom, etc.)
    if (e.touches.length > 1) {
      reset();
      return;
    }
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // otherwise the swipe is fired even with usual touch events
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndY.current = e.targetTouches[0].clientY; // otherwise the swipe is fired even with usual touch events
  }, [reset]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    // ignore multiple touches (pinch zoom, etc.)
    if (e.touches.length > 1) {
      reset();
      return;
    }

    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  }, [reset]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    // ignore multiple touches (pinch zoom, etc.)
    if (e.touches.length > 1) {
      reset();
      return;
    }

    if (!touchStartX || !touchEndX) return;
    if (!touchStartY || !touchEndY) return;

    const distanceX = touchStartX.current - touchEndX.current;
    let isLeftSwipe = distanceX > MIN_SWIPE_DISTANCE;
    let isRightSwipe = distanceX < -MIN_SWIPE_DISTANCE;

    const distanceY = touchStartY.current - touchEndY.current;
    let isUpSwipe = distanceY > MIN_SWIPE_DISTANCE;
    let isDownSwipe = distanceY < -MIN_SWIPE_DISTANCE;

    const isLR = isLeftSwipe || isRightSwipe;
    const isUD = isUpSwipe || isDownSwipe;

    // if this is both left/right and top/bottom, use the one
    // with the greater distance
    if (isLR && isUD) {
      const isDistanceXLarger = distanceX > distanceY;
      if (isDistanceXLarger) {
        isUpSwipe = isDownSwipe = false;
      }
      else {
        isLeftSwipe = isRightSwipe = false;
      }
    }

    // only invoke the specified function if it's been set
    if (isUpSwipe) {
      onSwipeUp?.();
    }
    else if (isDownSwipe) {
      onSwipeDown?.();
    }
    else if (isLeftSwipe) {
      onSwipeLeft?.();
    }
    else if (isRightSwipe) {
      onSwipeRight?.();
    }
  }, [reset, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (modal && !enabledOnModal) return;
    document.body.addEventListener('touchstart', onTouchStart);
    document.body.addEventListener('touchend', onTouchEnd);
    document.body.addEventListener('touchmove', onTouchMove);
    return () => {
      document.body.removeEventListener('touchstart', onTouchStart);
      document.body.removeEventListener('touchend', onTouchEnd);
      document.body.removeEventListener('touchmove', onTouchMove);
    };
  }, [modal, enabledOnModal, onTouchStart, onTouchEnd, onTouchMove]);
};

export { useSwipe as default };
