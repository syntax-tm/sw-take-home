'use server';

import { networkInterfaces } from "os";

export async function getMacAddresses() {
  const interfaces = networkInterfaces();
  const macs: Record<string, string> = {};

  for (const interfaceName in interfaces) {
    // Filter out internal/loopback interfaces if you only want external ones
    const currentInterface = interfaces[interfaceName];

    currentInterface?.forEach((details) => {
      // Filter to get non-internal MAC addresses
      if (!details.internal && details.mac !== '00:00:00:00:00:00') {
        if (!macs[interfaceName]) {
          macs[interfaceName] = details.mac;
        }
      }
    });
  }
  return macs;
};
