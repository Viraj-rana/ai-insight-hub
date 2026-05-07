/** Returns a same-origin relative path for redirect, or null if unsafe (open redirect). */
export function getSafeRedirectPath(raw: string | null): string | null {
  if (raw == null || typeof raw !== 'string') return null;
  let decoded = raw.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null;
  return decoded;
}
