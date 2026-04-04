const USER_STORAGE_KEY = "user";

function resolveUserScope(): string {
  if (typeof window === "undefined") return "anon";

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) return "anon";

  try {
    const parsed = JSON.parse(rawUser) as {
      id?: string;
      _id?: string;
      email?: string;
      mobile?: string;
    };

    const scope = parsed.id || parsed._id || parsed.email || parsed.mobile;
    if (typeof scope !== "string") return "anon";

    const normalized = scope.trim();
    return normalized.length > 0 ? normalized : "anon";
  } catch {
    return "anon";
  }
}

export function getScopedStorageKey(baseKey: string): string {
  return `${baseKey}:${resolveUserScope()}`;
}

export function getScopedLocalStorageItem(baseKey: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(getScopedStorageKey(baseKey));
}

export function setScopedLocalStorageItem(baseKey: string, value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getScopedStorageKey(baseKey), value);
}
