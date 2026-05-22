import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { friendlyApiMessage, messageForStatus, parseApiDetail } from './errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

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
type ApiOptions = RequestInit & { silent?: boolean };

async function executeFetch(
  method: string,
  path: string,
  options: ApiOptions = {},
  _isRetry = false
): Promise<any> {
  const { silent, ...fetchOptions } = options;
  console.log(`[API] 🚀 ${method} ${path}${_isRetry ? ' (retry)' : ''}`);

  const token = await getAccessToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, !isFormData),
    cache: 'no-store',
    ...fetchOptions,
  }).catch((err: Error) => {
    console.error(`[API] ❌ Network error on ${method} ${path}:`, err);
    const networkMsg =
      'Unable to connect. Check your internet connection and try again.';
    if (!silent) toast.error(networkMsg);
    const wrapped = new Error(networkMsg) as Error & { isApiError: boolean; status: number };
    wrapped.isApiError = true;
    wrapped.status = 0;
    throw wrapped;
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

  return handleResponse(response, silent);
}

export const api = {
  get: (path: string, options?: ApiOptions) => executeFetch('GET', path, options),
  post: (path: string, body: unknown, options?: ApiOptions) =>
    executeFetch('POST', path, { ...options, body: JSON.stringify(body) }),
  put: (path: string, body: unknown, options?: ApiOptions) =>
    executeFetch('PUT', path, { ...options, body: JSON.stringify(body) }),
  delete: (path: string, options?: ApiOptions) => executeFetch('DELETE', path, options),
  postForm: (path: string, formData: FormData, options?: ApiOptions) =>
    executeFetch('POST', path, { ...options, body: formData }),
};

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------
async function handleResponse(response: Response, silent = false): Promise<any> {
  if (response.ok) {
    // 204 No Content or similar — nothing to parse
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return response.json();
  }

  let errorMessage = messageForStatus(response.status);

  try {
    const body = await response.clone().json();
    const parsed = parseApiDetail(body?.detail) ?? parseApiDetail(body?.message);
    if (parsed) errorMessage = parsed;
    else if (typeof body?.detail === 'string') errorMessage = friendlyApiMessage(body.detail);
    else if (typeof body?.message === 'string') errorMessage = friendlyApiMessage(body.message);
  } catch {
    if (response.status >= 500) {
      errorMessage = messageForStatus(500);
    } else if (response.status === 404) {
      errorMessage = messageForStatus(404);
    } else {
      try {
        const text = await response.text();
        if (text && text.length < 200) errorMessage = friendlyApiMessage(text);
      } catch { /* ignore */ }
    }
  }

  console.error(`[API] 🚨 ${response.status}:`, errorMessage);

  if (!silent) {
    if (response.status >= 500) {
      toast.error(errorMessage, { duration: 5000 });
    } else if (response.status === 401) {
      /* session flow shows its own toast */
    } else if (response.status !== 404) {
      toast(errorMessage, {
        icon: '⚠️',
        duration: 4500,
        style: {
          background: '#fffbeb',
          color: '#92400e',
          border: '1px solid #fde68a',
        },
      });
    }
  }

  const err = new Error(errorMessage) as Error & { status: number; isApiError: boolean };
  err.status = response.status;
  err.isApiError = true;
  throw err;
}
