export type StoreValue = unknown;

const store = new Map<string, StoreValue>();

export function setItem<T>(key: string, value: T): T {
  store.set(key, value);
  return value;
}

export function getItem<T>(key: string, fallback: T): T {
  if (!store.has(key)) {
    return fallback;
  }

  return store.get(key) as T;
}

export function deleteItem(key: string): boolean {
  return store.delete(key);
}

export function listKeys(prefix = ''): string[] {
  return Array.from(store.keys()).filter((key) => key.startsWith(prefix));
}

export function clearStore(): void {
  store.clear();
}
