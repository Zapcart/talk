import type { ApiResponse } from '@/types/talkops';
import type { User } from 'firebase/auth';

export async function authenticatedFetch<T>(
  user: User,
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<T> {
  const token = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, { ...init, headers });
  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || 'error' in result) {
    throw new Error(result.error || 'The request could not be completed.');
  }

  return result.data;
}
