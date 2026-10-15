"use client";

import { useEffect } from "react";
import { DeviceType } from "@enums";

const getMobileDetect = (userAgent: NavigatorID["userAgent"]) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i));
  const isMobile = () =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => Boolean(!isMobile() && !isSSR());
  const deviceType = () => {
    if (isMobile()) {
      return DeviceType.MOBILE;
    }
    return DeviceType.DESKTOP;
  };
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
    deviceType,
  };
};

export const useMobileDetect = () => {
  useEffect(() => { }, []);
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  return getMobileDetect(userAgent);
};

export { useMobileDetect as default };
