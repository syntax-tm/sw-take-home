export function tryParseJSONObject<T>(jsonString: string | undefined) {
  if (!jsonString) return false;
  try {
    const o = JSON.parse(jsonString) as T;

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o;
    }
  }
  catch {
    return false;
  }
};

export function customReplacer(key: string, value: unknown) {
  if (value instanceof Map) {
    return { __dataType: "Map", value: Array.from(value.entries()) };
  }
  if (value instanceof Set) {
    return { __dataType: "Set", value: Array.from(value) };
  }
  if (typeof value === "bigint") {
    return { __dataType: "BigInt", value: value.toString() };
  }
  return value;
}
