import { describe, it, expect } from 'vitest';
import {
  CollectionFileSchema,
  validateCollectionFile,
  formatCollectionErrors,
} from './collection-schema';

describe('CollectionFileSchema', () => {
  describe('valid collection files', () => {
    it('should validate a correct collection file', () => {
      const validFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: ['jotunn', 'cherufe'],
      };

      const result = CollectionFileSchema.safeParse(validFile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validFile);
      }
    });

    it('should validate an empty collection', () => {
      const validFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(validFile);
      expect(result.success).toBe(true);
    });

    it('should validate collection with all valid monster IDs', () => {
      const validFile = {
        version: '2.5',
        exportDate: '2025-10-17T12:00:00Z',
        collectedIds: ['jotunn', 'nixe', 'ooze', 'grimoire'],
      };

      const result = validateCollectionFile(validFile);
      expect(result.success).toBe(true);
    });

    it('should default to empty array if collectedIds is missing', () => {
      const fileWithoutIds = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
      };

      const result = CollectionFileSchema.safeParse(fileWithoutIds);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.collectedIds).toEqual([]);
      }
    });
  });

  describe('invalid version format', () => {
    it('should reject version without proper format', () => {
      const invalidFile = {
        version: '1',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid version format');
      }
    });

    it('should reject version with letters', () => {
      const invalidFile = {
        version: 'v1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });
  });

  describe('invalid date format', () => {
    it('should reject non-ISO datetime', () => {
      const invalidFile = {
        version: '1.0',
        exportDate: '2025-10-17',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid date format');
      }
    });

    it('should reject invalid datetime strings', () => {
      const invalidFile = {
        version: '1.0',
        exportDate: 'not a date',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });
  });

  describe('invalid monster IDs', () => {
    it('should reject non-existent monster IDs', () => {
      const invalidFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: ['fake-monster-id'],
      };

      const result = validateCollectionFile(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid monster ID');
      }
    });

    it('should reject empty string monster IDs', () => {
      const invalidFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: [''],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('cannot be empty');
      }
    });

    it('should reject mixed valid and invalid monster IDs', () => {
      const invalidFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: ['jotunn', 'invalid-id', 'cherufe'],
      };

      const result = validateCollectionFile(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid monster ID');
      }
    });

    it('should reject non-string values in collectedIds array', () => {
      const invalidFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: [123, 'jotunn'],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });
  });

  describe('missing required fields', () => {
    it('should reject file without version', () => {
      const invalidFile = {
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });

    it('should reject file without exportDate', () => {
      const invalidFile = {
        version: '1.0',
        collectedIds: [],
      };

      const result = CollectionFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });
  });

  describe('formatCollectionErrors', () => {
    it('should format validation errors into user-friendly messages', () => {
      const invalidFile = {
        version: '1',
        exportDate: 'invalid-date',
        collectedIds: ['fake-id'],
      };

      const result = validateCollectionFile(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMsg = formatCollectionErrors(result.error);
        expect(errorMsg).toBeTruthy();
        expect(typeof errorMsg).toBe('string');
        // Should contain at least one error message
        expect(errorMsg.length).toBeGreaterThan(0);
      }
    });

    it('should separate multiple errors with semicolons', () => {
      const invalidFile = {
        version: 'invalid',
        exportDate: 'invalid',
        collectedIds: [''],
      };

      const result = validateCollectionFile(invalidFile);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMsg = formatCollectionErrors(result.error);
        // Multiple errors should be separated by semicolons
        expect(errorMsg).toContain(';');
      }
    });
  });

  describe('validateCollectionFile helper', () => {
    it('should return success for valid data', () => {
      const validFile = {
        version: '1.0',
        exportDate: '2025-10-17T12:00:00.000Z',
        collectedIds: ['jotunn'],
      };

      const result = validateCollectionFile(validFile);
      expect(result.success).toBe(true);
    });

    it('should return error for invalid data', () => {
      const invalidFile = {
        version: 'bad',
        exportDate: 'bad',
        collectedIds: 'not-an-array',
      };

      const result = validateCollectionFile(invalidFile);
      expect(result.success).toBe(false);
    });

    it('should handle completely malformed input', () => {
      const result = validateCollectionFile(null);
      expect(result.success).toBe(false);
    });

    it('should handle undefined input', () => {
      const result = validateCollectionFile(undefined);
      expect(result.success).toBe(false);
    });
  });
});
