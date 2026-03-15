import { NextApiResponse } from 'next';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Success response helper
export function successResponse<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: ApiSuccessResponse<T>['meta']
) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  
  if (message) response.message = message;
  if (meta) response.meta = meta;
  
  return res.status(statusCode).json(response);
}

// Error response helper
export function errorResponse(
  res: NextApiResponse<ApiErrorResponse>,
  error: string,
  statusCode: number = 400,
  code?: string,
  details?: unknown
) {
  const response: ApiErrorResponse = {
    success: false,
    error,
  };
  
  if (code) response.code = code;
  if (details) response.details = details;
  
  return res.status(statusCode).json(response);
}

// Common error responses
export const errors = {
  unauthorized: (res: NextApiResponse) =>
    errorResponse(res, 'Unauthorized access', 401, 'UNAUTHORIZED'),
  
  forbidden: (res: NextApiResponse) =>
    errorResponse(res, 'Access forbidden', 403, 'FORBIDDEN'),
  
  notFound: (res: NextApiResponse, resource: string = 'Resource') =>
    errorResponse(res, `${resource} not found`, 404, 'NOT_FOUND'),
  
  badRequest: (res: NextApiResponse, message: string = 'Bad request') =>
    errorResponse(res, message, 400, 'BAD_REQUEST'),
  
  validationError: (res: NextApiResponse, details: unknown) =>
    errorResponse(res, 'Validation failed', 400, 'VALIDATION_ERROR', details),
  
  serverError: (res: NextApiResponse, error?: Error) => {
    console.error('Server Error:', error);
    return errorResponse(res, 'Internal server error', 500, 'SERVER_ERROR');
  },
  
  methodNotAllowed: (res: NextApiResponse, allowed: string[]) =>
    errorResponse(
      res,
      `Method not allowed. Allowed: ${allowed.join(', ')}`,
      405,
      'METHOD_NOT_ALLOWED'
    ),
    
  rateLimited: (res: NextApiResponse) =>
    errorResponse(res, 'Too many requests. Please try again later.', 429, 'RATE_LIMITED'),
    
  serviceUnavailable: (res: NextApiResponse, service: string) =>
    errorResponse(res, `${service} is temporarily unavailable`, 503, 'SERVICE_UNAVAILABLE'),
};

// Pagination helper
export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; meta: ApiSuccessResponse<T[]>['meta'] } {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    items: items.slice(startIndex, endIndex),
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
