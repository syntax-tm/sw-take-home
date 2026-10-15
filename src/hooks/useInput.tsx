import { useEffect, useState } from "react";
import { InputType } from "@enums";

const resolveInputType = (userAgent: NavigatorID["userAgent"], isGamepadConnected: boolean) => {
  if (isGamepadConnected) {
    return InputType.GAMEPAD;
  }

  const isAndroid = Boolean(userAgent.match(/Android/i));
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = Boolean(userAgent.match(/Opera Mini/i));
  const isIEMobile = Boolean(userAgent.match(/IEMobile/i));
  const isMobile = isAndroid || isIos || isOpera || isIEMobile;

  if (isMobile) {
    return InputType.TOUCH;
  }

  return InputType.DEFAULT;
};

export const useInput = () => {
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateGamepadState = () => {
      const hasGamepad = navigator.getGamepads?.().some(Boolean) ?? false;
      setIsGamepadConnected(hasGamepad);
    };

    updateGamepadState();

    window.addEventListener("gamepadconnected", updateGamepadState);
    window.addEventListener("gamepaddisconnected", updateGamepadState);

    return () => {
      window.removeEventListener("gamepadconnected", updateGamepadState);
      window.removeEventListener("gamepaddisconnected", updateGamepadState);
    };
  }, []);

  const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const inputType = resolveInputType(userAgent, isGamepadConnected);

  return {
    inputType,
    isGamepad: inputType === InputType.GAMEPAD,
    isMobile: inputType === InputType.TOUCH,
    isDesktop: inputType === InputType.DEFAULT,
  };
};

export { useInput as default };
