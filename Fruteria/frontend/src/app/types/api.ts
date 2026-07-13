export type ApiStatus = 'ok' | 'error';

export type ApiErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export interface ApiResponse<T> {
  status: ApiStatus;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  status: 'error';
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string[]>;
  requestId?: string;
}

export interface ApiListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiAuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}
