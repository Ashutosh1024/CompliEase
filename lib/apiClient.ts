// lib/apiClient.ts
// All frontend API calls go through this module.
// Token is stored in localStorage as 'msme_token'.

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('msme_token');
}

export function setToken(token: string) {
  localStorage.setItem('msme_token', token);
}

export function clearToken() {
  localStorage.removeItem('msme_token');
  localStorage.removeItem('msme_user');
}

export function getStoredUser(): { id: string; name: string; email: string; plan: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('msme_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function storeUser(user: { id: string; name: string; email: string; plan: string }) {
  localStorage.setItem('msme_user', JSON.stringify(user));
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function apiSignup(name: string, email: string, password: string) {
  const res = await apiFetch('/api/auth/signup', {
    method: 'POST', body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  setToken(data.token);
  storeUser(data.user);
  return data;
}

export async function apiLogin(email: string, password: string) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  setToken(data.token);
  storeUser(data.user);
  return data;
}

export function apiLogout() {
  clearToken();
}

// ── Profile ───────────────────────────────────────────────────────────────
export async function apiGetProfile() {
  const res = await apiFetch('/api/profile');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data.profile;
}

export async function apiSaveProfile(profile: Record<string, unknown>) {
  const res = await apiFetch('/api/profile', {
    method: 'POST', body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save profile');
  return data.profile;
}

// ── Documents ─────────────────────────────────────────────────────────────
export async function apiGetDocuments() {
  const res = await apiFetch('/api/documents');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch documents');
  return data.documents as {
    id: string; name: string; category: string; size: string;
    mimeType: string; createdAt: string;
  }[];
}

export async function apiUploadDocument(file: File, category: string) {
  return new Promise<{ id: string; name: string; category: string; size: string; createdAt: string }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileData = (e.target?.result as string).split(',')[1]; // base64
          const sizeKB = Math.round(file.size / 1024);
          const res = await apiFetch('/api/documents', {
            method: 'POST',
            body: JSON.stringify({
              name: file.name, category, mimeType: file.type,
              size: sizeKB > 1024 ? `${(sizeKB/1024).toFixed(1)} MB` : `${sizeKB} KB`,
              fileData,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Upload failed');
          resolve(data.document);
        } catch (err) { reject(err); }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    }
  );
}

export async function apiDeleteDocument(id: string) {
  const res = await apiFetch(`/api/documents?id=${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Delete failed');
  return data;
}

// ── Chat ──────────────────────────────────────────────────────────────────
export async function apiChat(
  message: string,
  history: { role: string; content: string }[],
  businessContext?: Record<string, unknown>
): Promise<string> {
  const res = await apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history, businessContext }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat failed');
  return data.reply as string;
}

// ── Schemes ───────────────────────────────────────────────────────────────
export async function apiGetSchemes() {
  const res = await apiFetch('/api/schemes');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch schemes');
  return data.schemes;
}
