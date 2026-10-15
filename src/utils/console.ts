import { isDev } from "./env";

export const reset = '\u001b[0m';
export const e = '\u001b';
export const fg = {
  black: '\u001b[0;31m',
  red: '\u001b[0;31m',
  green: '\u001b[0;32m',
  yellow: '\u001b[0;33m',
  blue: '\u001b[0;34m',
  magenta: '\u001b[0;35m',
  cyan: '\u001b[0;36m',
  white: '\u001b[0;37m',
  brightBlack: '\u001b[0;90m',
  brightRed: '\u001b[0;91m',
  brightGreen: '\u001b[0;92m',
  brightYellow: '\u001b[0;93m',
  brightBlue: '\u001b[0;94m',
  brightMagenta: '\u001b[0;95m',
  brightCyan: '\u001b[0;96m',
  brightWhite: '\u001b[0;97m',
  reset: '\u001b[39m',
} as const;
export const bg = {
  black: '\u001b[0;41m',
  red: '\u001b[0;41m',
  green: '\u001b[0;42m',
  yellow: '\u001b[0;43m',
  blue: '\u001b[0;44m',
  magenta: '\u001b[0;45m',
  cyan: '\u001b[0;46m',
  white: '\u001b[0;47m',
  brightBlack: '\u001b[0;100m',
  brightRed: '\u001b[0;101m',
  brightGreen: '\u001b[0;102m',
  brightYellow: '\u001b[0;103m',
  brightBlue: '\u001b[0;104m',
  brightMagenta: '\u001b[0;105m',
  brightCyan: '\u001b[0;106m',
  brightWhite: '\u001b[0;107m',
  reset: '\u001b[49m',
} as const;
export const fx = {
  bold: '\u001b[1m',
  boldOff: '\u001b[22m',
  faint: '\u001b[2m',
  faintOff: '\u001b[22m',
  italic: '\u001b[3m',
  italicOff: '\u001b[23m',
  underline: '\u001b[4m',
  underlineOff: '\u001b[24m',
  blinking: '\u001b[5m',
  blinkingOff: '\u001b[25m',
  reverse: '\u001b[7m',
  reverseOff: '\u001b[27m',
  strikethrough: '\u001b[9m',
  strikethroughOff: '\u001b[29m',
  hide: '\u001b[8m',
  reveal: '\u001b[28m',
  superscript: '\u001b[73m',
  subscript: '\u001b[74m',
  scriptOff: '\u001b[75m',
} as const;
export const style = {
  fg,
  bg,
  fx,
  e,
} as const;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  // Remove leading # if present
  let cleanHex = hex.trim().replace(/^#/, '');

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }

  // Validate and match the 6-digit hex format
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);

  if (!result) {
    return null;
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export const json = (object: object | undefined | null) => {
  return logJson(object);
};
export const logJson = (object: object | undefined | null) => {
  const json = formatJson(object);
  console.log(json);
};
export const getAnsiColor = (rgb: RGB, type: "FOREGROUND" | "BACKGROUND" = "FOREGROUND") => {
  return getAnsiRgb(rgb.r, rgb.b, rgb.g, type);
};
export const getAnsiRgb = (r: number, g: number, b: number, type: "FOREGROUND" | "BACKGROUND" = "FOREGROUND") => {
  const t = type === "FOREGROUND" ? '38' : '48';
  const code = `${e}[${t};2;${r};${g};${b}m`;
  return code;
};
function toAnsi(color: string | RGB, type: "FOREGROUND" | "BACKGROUND" = "FOREGROUND") {
  if (typeof color === 'string') {
    const rgb = hexToRgb(color);
    if (!rgb) return null;
    return getAnsiColor(rgb, type);
  }
  return getAnsiColor(color, type);
}
export const getGrayscale = (value: number) => {
  const code = `${e}[${value}m`;
  return code;
};

export const formatJson = (object: object | undefined | null) => {
  const punctuation = /(\{\}$|\{$|,$|:|\[|\]|\}$)/gim;
  const keywords = /\s(true|false|null)/gim;
  const propertyName = /^(?<spacing>\s+)"(?<name>\w+)"/gim;
  const braces = /(\{\}$|\{$|\}$|,$|:|\},?|\{)/gim;
  const digits = /\s(-?[\d\.]+(?:,|$))/gim;

  if (!object) {
    return `${fg.brightBlue}${object}${reset}`;
  }

  let json = JSON.stringify(object, null, 2);
  json = json.replace(/: "(.+?)"/gmi, `: ${getAnsiRgb(255, 183, 77)}"$1"${reset}`);
  json = json.replace(braces, `${getAnsiRgb(130, 130, 130)}$1${reset}`);
  //json = json.replace(punctuation, `${getAnsiRgb(10, 10, 10)}$1${reset}`);
  json = json.replace(digits, ` ${toAnsi('#FFF176')}$1${reset}`);
  json = json.replace(keywords, ` ${toAnsi('#42A5F5')}$1${reset}`);
  json = json.replace(propertyName, `$<spacing>${toAnsi('#7986CB')}"$<name>"${reset}`);

  return json;
};

export type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export const formatMessage = (severity: Severity, message: string, e?: Error, showSeverity?: boolean) => {
  let color;

  switch (severity) {
    case 'DEBUG': color = fg.brightGreen; break;
    case 'INFO': color = fg.brightBlue; break;
    case 'WARN': color = fg.brightYellow; break;
    case 'ERROR': color = fg.brightRed; break;
    case 'FATAL': color = fg.brightRed; break;
  }

  let text = showSeverity
    ? `${color}[${severity.padEnd(5)}]${reset}: ${message} `
    : `${color}${message} `;

  if (e) {
    text += `${e.message}\n`;
    text += isDev
      ? `${e.stack}${reset}`
      : `${reset}`;
  }

  return text;
};

export const debug = (message: string, e?: Error, showSeverity: boolean = true) => {
  const text = formatMessage('DEBUG', message, e, showSeverity);

  console.log(text);
};

export const info = (message: string, e?: Error, showSeverity: boolean = true) => {
  const text = formatMessage('INFO', message, e, showSeverity);

  console.log(text);
};

export const warn = (message: string, e?: Error, showSeverity: boolean = true) => {
  const text = formatMessage('WARN', message, e, showSeverity);

  console.log(text);
};

export const error = (message: string, e?: Error, showSeverity: boolean = true) => {
  const text = formatMessage('ERROR', message, e, showSeverity);

  console.log(text);
};

export const log = {
  style,
  debug,
  info,
  warn,
  error,
  formatJson,
  json,
  dump: json,
  logJson,
  formatMessage,
} as const;
