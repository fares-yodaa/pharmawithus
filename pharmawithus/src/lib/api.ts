import { supabase } from './supabase';
import toast from 'react-hot-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pharmawithus-backend-564737438967.me-central1.run.app';

// ---------------------------------------------------------------------------
// Session token cache
//
// We share ONE promise across concurrent requests that fire at the same time
// (e.g. three components mounting at once on page load).
//
// RULES:
//  - Only cache a SUCCESSFUL resolution; clear the cache immediately on error
//    so a failed promise is never reused.
//  - Cache expires after 4 minutes so we always get a fresh token before
//    Supabase's 5-minute expiry window hits.
//  - On a 401, we clear the cache and retry ONCE with a fresh token before
//    giving up, avoiding spurious logouts from race conditions.
// ---------------------------------------------------------------------------
let sessionPromise: Promise<string | null> | null = null;
let sessionPromiseTimer: ReturnType<typeof setTimeout> | null = null;

export function clearSessionCache() {
  if (sessionPromiseTimer) clearTimeout(sessionPromiseTimer);
  sessionPromise = null;
  sessionPromiseTimer = null;
}

async function getAccessToken(): Promise<string | null> {
  if (!sessionPromise) {
    sessionPromise = supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        // Schedule cache expiry at 4 minutes (tokens last 5 min)
        sessionPromiseTimer = setTimeout(clearSessionCache, 4 * 60 * 1000);
        return session?.access_token ?? null;
      })
      .catch((err) => {
        // Never cache a failure — clear immediately so the next request retries
        clearSessionCache();
        console.error('[API] Failed to get session:', err);
        return null;
      });
  }
  return sessionPromise;
}

function buildHeaders(token: string | null, isJson = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ---------------------------------------------------------------------------
// Core fetch with one automatic retry on 401
// ---------------------------------------------------------------------------
async function executeFetch(
  method: string,
  path: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<any> {
  console.log(`[API] 🚀 ${method} ${path}${_isRetry ? ' (retry)' : ''}`);

  const token = await getAccessToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, !isFormData),
    cache: 'no-store',
    ...options,
  }).catch((err: Error) => {
    // Network-level failure (no internet, CORS, DNS, etc.)
    console.error(`[API] ❌ Network error on ${method} ${path}:`, err);
    toast.error('Unable to connect to the server. Please check your connection.');
    throw err;
  });

  console.log(`[API] ← ${response.status} ${method} ${path}`);

  // On 401, clear the token cache and retry once with a fresh session.
  // This handles the case where the cached token just expired.
  if (response.status === 401 && !_isRetry) {
    console.warn('[API] 401 received — clearing token cache and retrying once...');
    clearSessionCache();
    return executeFetch(method, path, options, true);
  }

  // If STILL 401 after retry → the session is genuinely invalid, log out.
  if (response.status === 401 && _isRetry) {
    console.error('[API] 🚨 401 after retry — session invalid, signing out');
    toast.error('Your session has expired. Please log in again.');
    await supabase.auth.signOut();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return handleResponse(response);
}

// ---------------------------------------------------------------------------
// Public API surface
// ---------------------------------------------------------------------------
export const api = {
  get: (path: string) => executeFetch('GET', path),
  post: (path: string, body: unknown) =>
    executeFetch('POST', path, { body: JSON.stringify(body) }),
  put: (path: string, body: unknown) =>
    executeFetch('PUT', path, { body: JSON.stringify(body) }),
  delete: (path: string) => executeFetch('DELETE', path),
  postForm: (path: string, formData: FormData) =>
    executeFetch('POST', path, { body: formData }),
};

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------
async function handleResponse(response: Response): Promise<any> {
  if (response.ok) {
    // 204 No Content or similar — nothing to parse
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return response.json();
  }

  // Error path — try to extract a human-readable message
  let errorMessage = 'An unexpected error occurred.';
  try {
    const body = await response.clone().json();
    errorMessage = body.detail || body.message || errorMessage;
  } catch {
    // Non-JSON body (HTML gateway error, etc.)
    if (response.status >= 500) {
      errorMessage = 'The server is currently unavailable. Please try again later.';
    } else if (response.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (response.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else {
      try {
        const text = await response.text();
        if (text && text.length < 200) errorMessage = text;
      } catch { /* ignore */ }
    }
  }

  console.error(`[API] 🚨 ${response.status}:`, errorMessage);
  
  // Show a soft note for user errors (4xx), skip 404s completely (handled by page empty states), 
  // and only show red errors for 5xx system failures.
  if (response.status >= 500) {
    toast.error(errorMessage);
  } else if (response.status !== 404) {
    toast(errorMessage, { icon: 'ℹ️' });
  }

  const err: any = new Error(errorMessage);
  err.status = response.status;
  err.isApiError = true;
  throw err;
}
