import type { ApiErrorResponse, ApiResponse } from '../types/api';

export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  auth: {
    login: `/${API_VERSION}/auth/login`,
    refresh: `/${API_VERSION}/auth/refresh`,
    logout: `/${API_VERSION}/auth/logout`,
    me: `/${API_VERSION}/auth/me`,
  },
  catalog: {
    products: `/${API_VERSION}/products`,
    categories: `/${API_VERSION}/categories`,
    units: `/${API_VERSION}/units`,
  },
  inventory: {
    stock: `/${API_VERSION}/inventory/stock`,
    movements: `/${API_VERSION}/inventory/movements`,
    adjustments: `/${API_VERSION}/inventory/adjustments`,
  },
  sales: {
    checkout: `/${API_VERSION}/sales`,
    tickets: `/${API_VERSION}/sales/tickets`,
  },
  cash: {
    open: `/${API_VERSION}/cash/open`,
    close: `/${API_VERSION}/cash/close`,
    movements: `/${API_VERSION}/cash/movements`,
  },
} as const;

export class HttpError extends Error {
  status: number;
  payload?: ApiErrorResponse;

  constructor(message: string, status: number, payload?: ApiErrorResponse) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;
  }
}

function getBaseUrl() {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return rawBaseUrl?.replace(/\/$/, '') ?? '';
}

export function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const isJsonResponse = response.headers.get('content-type')?.includes('application/json');
  const payload = isJsonResponse ? await response.json() : undefined;

  if (!response.ok) {
    throw new HttpError(
      payload?.message ?? response.statusText,
      response.status,
      payload as ApiErrorResponse | undefined,
    );
  }

  return payload as ApiResponse<T>;
}
