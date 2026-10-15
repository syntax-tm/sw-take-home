export class CaseInsensitiveMap<V, K extends string = string> extends Map<K, V> {
  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super();
    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  normalizeKey(key: K) {
    return String(key).toLowerCase() as K;
  }

  override has(key: K): boolean {
    return super.has(this.normalizeKey(key));
  }

  override get(key: K): V | undefined {
    return super.get(this.normalizeKey(key));
  }

  override set(key: K, value: V): this {
    return super.set(this.normalizeKey(key), value);
  }

  override delete(key: K): boolean {
    return super.delete(this.normalizeKey(key));
  }
}

export { CaseInsensitiveMap as default };
