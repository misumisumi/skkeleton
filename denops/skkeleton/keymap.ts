import { config } from "./config.ts";
import type { Context } from "./context.ts";
import { kakutei, newline } from "./function/common.ts";
import { disable, escape } from "./function/disable.ts";
import {
  henkanBackward,
  henkanFirst,
  henkanForward,
  henkanInput,
} from "./function/henkan.ts";
import {
  deleteChar,
  henkanPoint,
  inputCancel,
  kanaInput,
  katakana,
} from "./function/input.ts";
import { keyToNotation } from "./notation.ts";

type KeyHandler = (context: Context, char: string) => void | Promise<void>;

type KeyMap = {
  default: KeyHandler;
  map: Record<string, KeyHandler>;
};

const input: KeyMap = {
  default: kanaInput,
  map: {
    ";": henkanPoint,
    "<bs>": deleteChar,
    "<c-g>": inputCancel,
    "<c-h>": deleteChar,
    "<enter>": newline,
    "<esc>": escape,
    "<nl>": kakutei,
    "<space>": henkanFirst,
    "l": disable,
    "q": katakana,
  },
};

const henkan: KeyMap = {
  default: henkanInput,
  map: {
    "<enter>": newline,
    "<nl>": kakutei,
    "<space>": henkanForward,
    "x": henkanBackward,
  },
};

const keyMaps: Record<string, KeyMap> = {
  "input": input,
  "henkan": henkan,
};

export async function handleKey(context: Context, key: string) {
  const keyMap = keyMaps[context.state.type];
  if (!keyMap) {
    throw new Error("Illegal State: " + context.state.type);
  }
  if (config.debug) {
    console.log(`handleKey: key: ${key}, notation: ${keyToNotation[key]}`);
  }
  await ((keyMap.map[keyToNotation[key] ?? key] ?? keyMap.default)(
    context,
    key,
  ) ?? Promise.resolve());
}
