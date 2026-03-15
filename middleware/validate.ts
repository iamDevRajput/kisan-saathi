import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { ZodSchema, ZodError } from 'zod';
import { errors } from '../lib/apiResponse';

export function withValidation<T>(
  schema: ZodSchema<T>,
  source: 'body' | 'query' = 'body'
) {
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const data = source === 'body' ? req.body : req.query;
        const validatedData = schema.parse(data);
        
        if (source === 'body') {
          req.body = validatedData;
        } else {
          (req as any).validatedQuery = validatedData;
        }
        
        return handler(req, res);
      } catch (error) {
        if (error instanceof ZodError) {
          return errors.validationError(res, error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })));
        }
        throw error;
      }
    };
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return withValidation(schema, 'body');
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return withValidation(schema, 'query');
}
