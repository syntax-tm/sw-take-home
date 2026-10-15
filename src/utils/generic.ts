export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function convertToRecord<K extends string | number | symbol, V>(map: Map<K, V>): Record<K, V> {
  return Object.fromEntries(map.entries()) as Record<K, V>;
}

export function isMap<K, V>(value: unknown): value is Map<K, V> {
  return value instanceof Map;
}
