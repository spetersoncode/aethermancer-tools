import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle Tailwind conflicts', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('should filter out falsy values', () => {
    const condition = false;
    const result = cn('text-red-500', condition && 'bg-blue-500', 'font-bold');
    expect(result).toBe('text-red-500 font-bold');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});
