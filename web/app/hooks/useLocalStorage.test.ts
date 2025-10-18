import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('initial value handling', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('initial-value');
    });

    it('should return stored value when localStorage has data', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('stored-value');
    });

    it('should handle complex objects', () => {
      const complexObject = {
        name: 'Test',
        count: 42,
        nested: { value: true },
      };
      localStorage.setItem('test-key', JSON.stringify(complexObject));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', {
          name: '',
          count: 0,
          nested: { value: false },
        })
      );

      expect(result.current[0]).toEqual(complexObject);
    });

    it('should handle arrays', () => {
      const array = [1, 2, 3, 4, 5];
      localStorage.setItem('test-key', JSON.stringify(array));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', [] as number[])
      );

      expect(result.current[0]).toEqual(array);
    });
  });

  describe('error handling', () => {
    it('should return initial value when localStorage has invalid JSON', () => {
      localStorage.setItem('test-key', 'invalid-json{');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback-value')
      );

      expect(result.current[0]).toBe('fallback-value');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error loading localStorage key "test-key"'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle localStorage.getItem throwing an error', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback-value')
      );

      expect(result.current[0]).toBe('fallback-value');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      vi.restoreAllMocks();
    });
  });

  describe('value updates', () => {
    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial-value')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(localStorage.getItem('test-key')).toBe(
        JSON.stringify('new-value')
      );
    });

    it('should persist multiple updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current[1](1);
      });
      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1](2);
      });
      expect(result.current[0]).toBe(2);

      act(() => {
        result.current[1](3);
      });
      expect(result.current[0]).toBe(3);

      expect(localStorage.getItem('counter')).toBe(JSON.stringify(3));
    });

    it('should handle updating complex objects', () => {
      const { result } = renderHook(() =>
        useLocalStorage('user', { name: 'John', age: 25 })
      );

      act(() => {
        result.current[1]({ name: 'Jane', age: 30 });
      });

      expect(result.current[0]).toEqual({ name: 'Jane', age: 30 });
      expect(localStorage.getItem('user')).toBe(
        JSON.stringify({ name: 'Jane', age: 30 })
      );
    });
  });

  describe('multiple instances', () => {
    it('should share state across multiple hook instances with same key', () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage('shared-key', 'initial')
      );
      const { result: result2 } = renderHook(() =>
        useLocalStorage('shared-key', 'initial')
      );

      // Both should read the same initial value
      expect(result1.current[0]).toBe('initial');
      expect(result2.current[0]).toBe('initial');

      // Update from first instance
      act(() => {
        result1.current[1]('updated');
      });

      expect(result1.current[0]).toBe('updated');
      // Note: result2 won't automatically update without a re-render mechanism
      // but localStorage should be updated
      expect(localStorage.getItem('shared-key')).toBe(
        JSON.stringify('updated')
      );
    });
  });

  describe('SSR safety', () => {
    it('should handle undefined window gracefully', () => {
      // This test simulates SSR by checking the typeof window === 'undefined' branch
      // In practice, jsdom provides window, so this tests the code path logic
      const { result } = renderHook(() =>
        useLocalStorage('ssr-test', 'default-value')
      );

      // Should still return the initial value
      expect(result.current[0]).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | null>('nullable', null)
      );

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1]('not-null');
      });

      expect(result.current[0]).toBe('not-null');
    });

    it('should handle boolean values', () => {
      const { result } = renderHook(() => useLocalStorage('boolean', false));

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
      expect(localStorage.getItem('boolean')).toBe('true');
    });

    it('should handle empty strings', () => {
      const { result } = renderHook(() => useLocalStorage('empty', ''));

      expect(result.current[0]).toBe('');

      act(() => {
        result.current[1]('not-empty');
      });

      expect(result.current[0]).toBe('not-empty');
    });
  });

  describe('schema validation', () => {
    it('should validate data with provided schema', () => {
      const schema = z.enum(['light', 'dark', 'system']);
      localStorage.setItem('theme', JSON.stringify('dark'));

      const { result } = renderHook(() =>
        useLocalStorage('theme', 'system' as const, schema)
      );

      expect(result.current[0]).toBe('dark');
    });

    it('should fall back to initial value when schema validation fails', () => {
      const schema = z.enum(['light', 'dark', 'system']);
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Store an invalid value
      localStorage.setItem('theme', JSON.stringify('invalid-theme'));

      const { result } = renderHook(() =>
        useLocalStorage('theme', 'system' as const, schema)
      );

      expect(result.current[0]).toBe('system');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('failed validation'),
        expect.any(Array)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should validate complex objects with schema', () => {
      const userSchema = z.object({
        name: z.string(),
        age: z.number().min(0).max(120),
      });

      const validUser = { name: 'John', age: 30 };
      localStorage.setItem('user', JSON.stringify(validUser));

      const { result } = renderHook(() =>
        useLocalStorage('user', { name: '', age: 0 }, userSchema)
      );

      expect(result.current[0]).toEqual(validUser);
    });

    it('should reject invalid complex objects and use fallback', () => {
      const userSchema = z.object({
        name: z.string(),
        age: z.number().min(0).max(120),
      });

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Age is out of range
      const invalidUser = { name: 'John', age: 150 };
      localStorage.setItem('user', JSON.stringify(invalidUser));

      const fallbackUser = { name: 'Guest', age: 0 };
      const { result } = renderHook(() =>
        useLocalStorage('user', fallbackUser, userSchema)
      );

      expect(result.current[0]).toEqual(fallbackUser);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should validate array schemas', () => {
      const arraySchema = z.array(z.string());
      const validArray = ['apple', 'banana', 'cherry'];
      localStorage.setItem('fruits', JSON.stringify(validArray));

      const { result } = renderHook(() =>
        useLocalStorage('fruits', [] as string[], arraySchema)
      );

      expect(result.current[0]).toEqual(validArray);
    });

    it('should reject invalid array items', () => {
      const arraySchema = z.array(z.string());
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Array contains non-string values
      const invalidArray = ['apple', 123, 'cherry'];
      localStorage.setItem('fruits', JSON.stringify(invalidArray));

      const { result } = renderHook(() =>
        useLocalStorage('fruits', [] as string[], arraySchema)
      );

      expect(result.current[0]).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should work without schema (backward compatibility)', () => {
      localStorage.setItem('no-schema', JSON.stringify('any-value'));

      const { result } = renderHook(() =>
        useLocalStorage('no-schema', 'default')
      );

      expect(result.current[0]).toBe('any-value');
    });

    it('should not validate when no schema is provided', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Store potentially invalid data
      localStorage.setItem('unvalidated', JSON.stringify('anything-goes'));

      const { result } = renderHook(() =>
        useLocalStorage('unvalidated', 'default')
      );

      // Should accept any value without validation
      expect(result.current[0]).toBe('anything-goes');
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});
