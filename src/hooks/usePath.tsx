"use client";

import { usePathname } from 'next/navigation';

const EMPTY_PATH = '';
const ROOT_PATH = '/';
const IGNORED_PATHS = [ EMPTY_PATH, ROOT_PATH ];

export interface PathOutput {
  modal: boolean;
  pathname: string;
}

// TODO: this would be useful when slots are added, especially for modals, depending on the site's navigation
export const usePath = (): PathOutput => {

  const pathname = usePathname();

  const modal = !IGNORED_PATHS.includes(pathname.toLowerCase());

  return {
    modal,
    pathname,
  };
};

export { usePath as default };
