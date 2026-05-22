/**
 * Maps API / auth errors to clear, actionable copy for end users.
 */

type ValidationErrorItem = { msg?: string; loc?: (string | number)[] };

/** Known backend detail strings → friendlier copy */
const API_MESSAGE_MAP: Record<string, string> = {
  'You already have a pending or approved order for this course':
    'You already have an order for this course. Check My Orders to see if it is pending or approved.',
  'Payment proof screenshot is required':
    'Please upload a screenshot of your payment to complete enrollment.',
  'A valid email is required':
    'Please enter a valid email address so we can confirm your order.',
  'Course not found or is not active':
    'This course is no longer available. Browse our catalog for other options.',
  'Course not found':
    'We could not find that course. It may have been removed.',
  'You do not have access to this course':
    'You do not have access to this course yet. Complete payment and wait for approval, or check My Orders.',
  'Failed to upload payment proof. Please try again.':
    'We could not upload your payment screenshot. Please try again with a smaller image (under 5MB).',
  'Failed to create order. Please try again.':
    'We could not submit your order. Please try again in a moment.',
  'Auth service temporarily unavailable. Please retry.':
    'Sign-in is temporarily unavailable. Please wait a moment and try again.',
  'Invalid or expired token':
    'Your session expired. Please sign in again.',
  'Invalid token: Supabase rejected the token':
    'Your session expired. Please sign in again.',
  'Not authenticated':
    'Please sign in to continue.',
  'Not enough privileges':
    'You do not have permission to do that.',
  'Internal Server Error':
    'Something went wrong on our side. Please try again shortly.',
  'Internal server error during authentication':
    'We could not verify your account. Please try again.',
};

const AUTH_MESSAGE_MAP: Record<string, string> = {
  'Invalid login credentials':
    'Incorrect email or password. Double-check your details or reset your password.',
  'Email not confirmed':
    'Please confirm your email before signing in. Check your inbox for the confirmation link.',
  'User already registered':
    'An account with this email already exists. Try signing in instead.',
  'Password should be at least 6 characters':
    'Choose a password with at least 6 characters.',
  'Unable to validate email address: invalid format':
    'Please enter a valid email address.',
};

function normalizeKey(text: string): string {
  return text.trim();
}

/** Turn FastAPI `detail` (string or validation array) into one readable sentence. */
export function parseApiDetail(detail: unknown): string | null {
  if (detail == null) return null;

  if (typeof detail === 'string') {
    return friendlyApiMessage(detail);
  }

  if (Array.isArray(detail)) {
    const items = detail as ValidationErrorItem[];
    const messages = items
      .map((item) => {
        const field = item.loc?.filter((p) => p !== 'body' && typeof p === 'string').pop();
        const msg = item.msg || '';
        if (field === 'file' && /required/i.test(msg)) {
          return 'Please upload a payment screenshot.';
        }
        if (field === 'payer_name' && /required/i.test(msg)) {
          return 'Please enter your full name.';
        }
        if (field === 'payer_email' && /required/i.test(msg)) {
          return 'Please enter your email address.';
        }
        return msg;
      })
      .filter(Boolean);
    if (messages.length === 1) return friendlyApiMessage(messages[0]);
    if (messages.length > 1) return messages.map(friendlyApiMessage).join(' ');
    return null;
  }

  if (typeof detail === 'object' && detail !== null && 'message' in detail) {
    const msg = (detail as { message?: string }).message;
    if (typeof msg === 'string') return friendlyApiMessage(msg);
  }

  return null;
}

export function friendlyApiMessage(raw: string): string {
  const key = normalizeKey(raw);
  if (API_MESSAGE_MAP[key]) return API_MESSAGE_MAP[key];

  if (/file too large/i.test(key)) {
    return 'That file is too large. Please use an image or PDF under 5MB.';
  }
  if (/uploaded file is empty/i.test(key)) {
    return 'The file appears empty. Please choose a different screenshot.';
  }
  if (/failed to upload file/i.test(key)) {
    return 'Upload failed. Please try a PNG, JPG, or PDF under 5MB.';
  }

  return key;
}

export function friendlyAuthMessage(raw: string): string {
  const key = normalizeKey(raw);
  return AUTH_MESSAGE_MAP[key] ?? key;
}

export function messageForStatus(status: number, detail?: unknown): string {
  const parsed = parseApiDetail(detail);
  if (parsed) return parsed;

  switch (status) {
    case 400:
      return 'Please check your information and try again.';
    case 401:
      return 'Please sign in to continue.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'This action conflicts with existing data. Refresh the page and try again.';
    case 422:
      return 'Please check the form and fix any highlighted fields.';
    case 503:
      return 'Our servers are busy. Please try again in a moment.';
    default:
      if (status >= 500) {
        return 'Something went wrong on our side. Please try again shortly.';
      }
      return 'Something went wrong. Please try again.';
  }
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!err) return fallback;

  if (err instanceof Error) {
    if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
      return 'Unable to connect. Check your internet connection and try again.';
    }
    if (err.message === 'Session expired') {
      return 'Your session expired. Please sign in again.';
    }
    const apiErr = err as Error & { status?: number; isApiError?: boolean };
    if (apiErr.isApiError && apiErr.message) {
      return friendlyApiMessage(apiErr.message);
    }
    if (err.message) return friendlyApiMessage(err.message);
  }

  if (typeof err === 'string') return friendlyApiMessage(err);

  return fallback;
}

export function isApiError(err: unknown): err is Error & { status: number; isApiError: true } {
  return err instanceof Error && (err as { isApiError?: boolean }).isApiError === true;
}

/** Context-specific fallbacks when lists fail to load */
export const LOAD_ERROR_COPY = {
  courses: 'We could not load your courses. Please try again.',
  browse: 'We could not load the course catalog. Please try again.',
  orders: 'We could not load your orders. Please try again.',
  lessons: 'We could not load lessons for this course. Please try again.',
  checkout: 'We could not load this course. Please go back to Browse Courses.',
  dashboard: 'We could not load dashboard data. Please try again.',
} as const;
