export const API_BASE: string | undefined = (import.meta as any).env?.VITE_API_BASE_URL || undefined;

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch {}
}

export async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new Error('API_BASE not configured');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    let err: any;
    try { err = await res.json(); } catch { err = { error: res.statusText }; }
    throw new Error(err.error || `HTTP_${res.status}`);
  }
  // try JSON; otherwise empty
  const text = await res.text();
  try { return text ? JSON.parse(text) : (undefined as any); } catch { return text as any; }
}
