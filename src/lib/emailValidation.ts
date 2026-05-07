export type RemoteEmailValidation = {
  valid: boolean;
  reason?: string | null;
  detail?: string | null;
};

/**
 * When VITE_EMAIL_VALIDATION_URL is set (e.g. http://127.0.0.1:8765), POSTs to /validate.
 * If the URL is unset, returns valid: true (no check).
 * On network failure, returns valid: true so signup is not blocked when the Python service is down.
 */
export async function validateEmailRemote(email: string): Promise<RemoteEmailValidation> {
  const raw = import.meta.env.VITE_EMAIL_VALIDATION_URL;
  const base = typeof raw === 'string' ? raw.replace(/\/$/, '').trim() : '';
  if (!base) {
    return { valid: true };
  }

  try {
    const res = await fetch(`${base}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = (await res.json().catch(() => null)) as RemoteEmailValidation | null;
    if (!res.ok || !data || typeof data.valid !== 'boolean') {
      return { valid: true };
    }
    return data;
  } catch {
    return { valid: true };
  }
}
