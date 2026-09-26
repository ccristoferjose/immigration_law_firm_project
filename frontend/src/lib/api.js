const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

let adminToken = localStorage.getItem('admin_token') || null;
let firebaseTokenProvider = null;

export function setAdminToken(t) {
  adminToken = t;
  if (t) localStorage.setItem('admin_token', t);
  else localStorage.removeItem('admin_token');
}

export function getAdminToken() {
  return adminToken;
}

export function setFirebaseTokenProvider(fn) {
  firebaseTokenProvider = fn;
}

async function request(method, path, { body, auth = 'none' } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth === 'admin' && adminToken) {
    headers.Authorization = `Bearer ${adminToken}`;
  } else if (auth === 'client' && firebaseTokenProvider) {
    const tok = await firebaseTokenProvider();
    if (tok) headers.Authorization = `Bearer ${tok}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.details = data.details;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (p, opts) => request('GET', p, opts),
  post: (p, body, opts) => request('POST', p, { ...opts, body }),
  put: (p, body, opts) => request('PUT', p, { ...opts, body }),
  del: (p, opts) => request('DELETE', p, opts),
  dashboard: () => request('GET', '/clients/self/dashboard', { auth: 'client' }),
};
