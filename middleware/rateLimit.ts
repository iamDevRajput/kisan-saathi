import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { checkRateLimit } from '../lib/redis';
import { errors } from '../lib/apiResponse';

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
  keyGenerator?: (req: NextApiRequest) => string;
}

const defaultKeyGenerator = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0]
    : req.socket.remoteAddress || 'unknown';
  return ip;
};

export function withRateLimit(config: RateLimitConfig) {
  const { maxRequests, windowSeconds, keyGenerator = defaultKeyGenerator } = config;
  
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const identifier = keyGenerator(req);
      const result = await checkRateLimit(identifier, maxRequests, windowSeconds);
      
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetAt);
      
      if (!result.allowed) {
        return errors.rateLimited(res);
      }
      
      return handler(req, res);
    };
  };
}

export const rateLimits = {
  standard: { maxRequests: 100, windowSeconds: 60 },
  strict: { maxRequests: 20, windowSeconds: 60 },
  ai: { maxRequests: 10, windowSeconds: 60 },
  auth: { maxRequests: 5, windowSeconds: 60 },
};
