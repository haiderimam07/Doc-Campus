import type { z, ZodType } from 'zod';
import { AppError } from './errors.js';

export function validate<S extends ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join('.') || 'input'}: ${i.message}`)
      .join('; ');
    throw new AppError(400, message, 'VALIDATION_ERROR');
  }
  return result.data;
}
