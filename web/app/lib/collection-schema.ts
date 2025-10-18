import { z } from 'zod';
import { MonsterIdSchema } from '~/data/monsters';

/**
 * Schema for validating collection export/import files
 */
export const CollectionFileSchema = z.object({
  version: z.string().regex(/^\d+\.\d+$/, 'Invalid version format (expected X.Y)'),
  exportDate: z.string().datetime('Invalid date format (expected ISO 8601 datetime)'),
  collectedIds: z.array(MonsterIdSchema).default([]),
});

/**
 * Infer TypeScript type from the schema (industry-standard pattern)
 */
export type CollectionFile = z.infer<typeof CollectionFileSchema>;

/**
 * Validate a collection file and return typed result
 */
export const validateCollectionFile = (data: unknown) => {
  return CollectionFileSchema.safeParse(data);
};

/**
 * Format Zod validation errors into user-friendly messages
 */
export const formatCollectionErrors = (error: z.ZodError): string => {
  return error.issues
    .map((e) => {
      const path = e.path.length > 0 ? `${e.path.join('.')}: ` : '';
      return `${path}${e.message}`;
    })
    .join('; ');
};
