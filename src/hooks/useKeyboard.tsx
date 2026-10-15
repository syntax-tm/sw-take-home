'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardEventKey as Key } from 'keyboard-event-key-type';
import { usePath, useActiveElement } from "@hooks";
import { fg, reset, isMap, CaseInsensitiveMap } from "utils";

type StandardVoidFn = () => void;
type KeyboardEventFn = (e: KeyboardEvent) => void;
type KeyEventHandler = KeyboardEventFn | StandardVoidFn;

const isFunction = (fn: unknown): fn is StandardVoidFn => typeof fn === 'function' && fn.length >= 1;
const isKeyEventHandler = (fn: unknown): fn is KeyboardEventFn => typeof fn === 'function' && fn.length >= 1;

export interface KeyPressAction {
  repeat: boolean;
  onKeyPress: KeyEventHandler;
}

function isKeyPressAction(obj: unknown): obj is KeyPressAction {
  return obj !== null
    && typeof obj === 'object'
    && "repeat" in obj
    && typeof obj.repeat === 'boolean'
    && "onKeyPress" in obj
    && typeof obj.onKeyPress === 'function';
}

export type RecordKeyMap = Partial<Record<Key, KeyPressAction | KeyEventHandler>>;
export type MapKeyMap<K extends string, V extends KeyEventHandler | KeyPressAction> = Map<K, V>;

export type ActionKeyMap = RecordKeyMap | MapKeyMap<Key, KeyPressAction | KeyEventHandler>;

export interface KeyboardInput {
  actions: ActionKeyMap;
  enabledOnModal: boolean | undefined;
}

export const useKeyboard = (input: KeyboardInput) => {
  const [keysDown, setKeysDown] = useState<string[]>([]);
  const { modal } = usePath();
  const { isInput } = useActiveElement();
  const actions = useMemo(() => {
    const map = new CaseInsensitiveMap<KeyPressAction | KeyEventHandler>();
    const a = input.actions;

    if (isMap<Key, KeyPressAction | KeyEventHandler>(a)) {
      a.forEach((v, k) => {
        map.set(k, v);
      });
    }
    else {
      Object.entries(a).forEach(([k, v]) => {
        if (!v) return;
        if (isKeyPressAction(v)) {
          map.set(k, v);
        }
        else if (isFunction(v)) {
          map.set(k, v);
        }
        else if (isKeyEventHandler(v)) {
          map.set(k, v);
        }
      });
    }

    return map;
  }, [input]);

  const isMapped = useCallback((key: Key): boolean => {
    return actions.has(key);
  }, [actions]);

  const getAction = useCallback((key: Key): KeyPressAction | KeyEventHandler | undefined => {
    return actions.get(key);
  }, [actions]);

  const getFunctionName = (name: string) => {
    const pattern = /use[a-zA-Z]+\[(.+?)\]/gi;
    const updated = name.replace(pattern, '$1');
    return updated;
  };

  const handleKeyUp = useCallback((e: KeyboardEvent): void => {
    // key is not mapped, ignore
    if (!isMapped(e.key)) return;

    if (modal && !input.enabledOnModal) return;

    //e.stopPropagation();
    //e.preventDefault();
    const updated = keysDown.filter((i) => i !== e.key);
    setKeysDown(updated);

    console.log(`keyup: ${fg.brightYellow}${e.key}${reset}`);
  }, [keysDown, input.enabledOnModal, isMapped, modal]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key: Key = e.key;

    // key is not mapped, ignore
    if (!isMapped(key)) return;

    if (modal && !input.enabledOnModal) return;

    // key is mapped, so retrieve the KeyPressAction
    const action = getAction(key);

    // TODO: this should throw an error
    if (!action) return;

    // if this is a repeat and we don't allow repeats
    if (e.repeat) {
      const shouldIgnore = isKeyPressAction(action) && !action.repeat;
      if (shouldIgnore) {
        return;
      }
    }

    const executeHandler = (
      fn: KeyEventHandler,
      event: KeyboardEvent,
    ) =>
    {
      if (isKeyEventHandler(fn)) {
        fn(event);
      } else {
        (fn as StandardVoidFn)();
      }
    };

    if (isKeyPressAction(action)) {
      console.log(`keydown: ${fg.brightYellow}${e.key}${reset} ${fg.brightBlack}=> ${fg.brightBlue}${getFunctionName(action.onKeyPress.name)}()${reset}`);
      executeHandler(action.onKeyPress, e);
    }
    else {
      console.log(`keydown: ${fg.brightYellow}${e.key}${reset} ${fg.brightBlack}=> ${fg.brightBlue}${getFunctionName(action.name)}()${reset}`);
      executeHandler(action, e);
    }

    setKeysDown((prevState) => [...prevState, e.key]);
  }, [isMapped, modal, getAction, input.enabledOnModal]);

  useEffect(() => {
    if (modal && !input.enabledOnModal) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp, handleKeyDown, modal, input.enabledOnModal]);
};

export { useKeyboard as default };
