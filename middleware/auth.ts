import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import { errors } from '../lib/apiResponse';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export function withAuth(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user) {
      return errors.unauthorized(res);
    }
    
    req.user = {
      id: (session.user as any).id as string,
      email: (session.user as any).email as string,
      name: (session.user as any).name || undefined,
      role: (session.user as any).role as string || 'FARMER',
    };
    
    return handler(req, res);
  };
}

export function withOptionalAuth(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (session?.user) {
      req.user = {
        id: (session.user as any).id as string,
        email: (session.user as any).email as string,
        name: (session.user as any).name || undefined,
        role: (session.user as any).role as string || 'FARMER',
      };
    }
    
    return handler(req, res);
  };
}

export function withRole(roles: string[]) {
  return (handler: NextApiHandler) => {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return errors.forbidden(res);
      }
      return handler(req, res);
    });
  };
}
