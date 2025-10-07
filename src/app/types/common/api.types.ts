
export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  nextCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export type ApiResponseSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta | null;
  statusCode?: number;
};

export type ApiResponseError = {
  success: false;
  message: string;
  errors?: string[];
  code?: string;
  statusCode?: number;
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

/**
 * Simplified Send Response for backend handlers
 * (used in services or controllers)
 */
export type TSendResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: PaginationMeta | null;
  data: T | null;
};

/**
 * Generic pagination response
 * (useful for Prisma or paginated APIs)
 */
export type TGenericResponse<T> = {
  meta: PaginationMeta;
  data: T;
};
