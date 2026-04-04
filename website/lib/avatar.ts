export function withCacheBust(url: string | undefined | null, version?: unknown): string {
  if (typeof url !== "string") return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  let stamp: string;
  if (typeof version === "string" || typeof version === "number") {
    const parsed = new Date(version).getTime();
    stamp = Number.isNaN(parsed) ? String(version) : String(parsed);
  } else if (version instanceof Date) {
    stamp = String(version.getTime());
  } else {
    stamp = String(Date.now());
  }

  const separator = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${separator}v=${encodeURIComponent(stamp)}`;
}
