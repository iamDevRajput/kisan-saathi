import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

// Success response helper
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    meta,
  });
}

// Error response helper
export function errorResponse(
  message: string,
  status: number = 500,
  details?: Record<string, string[]>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

// Parse pagination from request
export function getPaginationParams(request: NextRequest): Required<PaginationParams> {
  const searchParams = request.nextUrl.searchParams;
  
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10))),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };
}

// Create paginated response
export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: Required<PaginationParams>
): NextResponse<ApiResponse<PaginatedResponse<T>>> {
  const totalPages = Math.ceil(total / params.limit);
  
  return successResponse(
    {
      data,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    },
    undefined,
    {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
    }
  );
}

// Validate request body
export async function validateBody<T>(
  request: NextRequest,
  validator: (body: unknown) => { success: true; data: T } | { success: false; errors: string[] }
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const result = validator(body);
    
    if (!result.success) {
      return {
        success: false,
        response: errorResponse('Validation failed', 400, { body: result.errors }),
      };
    }
    
    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      response: errorResponse('Invalid JSON in request body', 400),
    };
  }
}

// Get user from session (placeholder - integrate with NextAuth)
export async function getCurrentUser(request: NextRequest): Promise<{ id: string; email: string; role: string } | null> {
  // This will be implemented with NextAuth session
  // For now, returning null - middleware will handle auth
  return null;
}

// Log API activity
export function logActivity(
  userId: string,
  activityType: string,
  description: string,
  metadata?: Record<string, unknown>
): void {
  // Async logging - don't await
  prisma.userActivity.create({
    data: {
      userId,
      activityType,
      description,
      metadata: metadata || {},
    },
  }).catch(console.error);
}

import { prisma } from '@/lib/prisma';
