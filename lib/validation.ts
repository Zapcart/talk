import { ApiError } from '@/lib/auth-server';

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, 'The request body must be valid JSON.');
  }
}

export function requiredString(value: unknown, field: string, maxLength = 20_000): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(400, `${field} is required.`);
  }
  const clean = value.trim();
  if (clean.length > maxLength) throw new ApiError(400, `${field} is too long.`);
  return clean;
}

export function nonNegativeNumber(value: unknown, field: string): number {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new ApiError(400, `${field} must be a non-negative number.`);
  return number;
}
