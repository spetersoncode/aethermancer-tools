import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  let matchMediaMock: {
    matches: boolean;
    media: string;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock matchMedia
    matchMediaMock = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      ...matchMediaMock,
      media: query,
    }));

    // Reset document classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial theme state', () => {
    it('should default to system theme', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('system');
    });

    it('should load saved theme from localStorage', () => {
      localStorage.setItem('theme-preference', JSON.stringify('dark'));

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
    });

    it('should handle light theme preference', () => {
      localStorage.setItem('theme-preference', JSON.stringify('light'));

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
    });
  });

  describe('theme application', () => {
    it('should add dark class when theme is dark', () => {
      localStorage.setItem('theme-preference', JSON.stringify('dark'));

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when theme is light', () => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-preference', JSON.stringify('light'));

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should apply dark class when system preference is dark', () => {
      matchMediaMock.matches = true;
      localStorage.setItem('theme-preference', JSON.stringify('system'));

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should not apply dark class when system preference is light', () => {
      matchMediaMock.matches = false;
      localStorage.setItem('theme-preference', JSON.stringify('system'));

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('theme switching', () => {
    it('should update theme when setTheme is called', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should persist theme changes to localStorage', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(localStorage.getItem('theme-preference')).toBe(
        JSON.stringify('light')
      );
    });

    it('should switch from light to dark', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      act(() => {
        result.current.setTheme('dark');
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should switch from dark to light', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      act(() => {
        result.current.setTheme('light');
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should switch to system theme', () => {
      matchMediaMock.matches = true;
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      act(() => {
        result.current.setTheme('system');
      });
      // Should now follow system preference (which is dark in this test)
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('effective theme calculation', () => {
    it('should return light as effective theme when theme is light', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.effectiveTheme).toBe('light');
    });

    it('should return dark as effective theme when theme is dark', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.effectiveTheme).toBe('dark');
    });

    it('should return system preference when theme is system (dark)', () => {
      matchMediaMock.matches = true;
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.effectiveTheme).toBe('dark');
    });

    it('should return system preference when theme is system (light)', () => {
      matchMediaMock.matches = false;
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.effectiveTheme).toBe('light');
    });
  });

  describe('media query listeners', () => {
    it('should add event listener when theme is system', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should not add event listener when theme is not system', () => {
      // Pre-set theme to dark so initial render doesn't set up system listener
      localStorage.setItem('theme-preference', JSON.stringify('dark'));

      const { result } = renderHook(() => useTheme());

      // Should not have added listener since theme is dark, not system
      expect(matchMediaMock.addEventListener).not.toHaveBeenCalled();

      act(() => {
        result.current.setTheme('light');
      });

      // Still should not add listener when switching to light
      expect(matchMediaMock.addEventListener).not.toHaveBeenCalled();
    });

    it('should remove event listener when switching from system to another theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      expect(matchMediaMock.addEventListener).toHaveBeenCalled();

      act(() => {
        result.current.setTheme('light');
      });

      expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should cleanup listener on unmount when theme is system', () => {
      const { result, unmount } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      unmount();

      expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('system theme changes', () => {
    it('should set up listener for system theme changes when theme is system', () => {
      matchMediaMock.matches = false;
      localStorage.setItem('theme-preference', JSON.stringify('system'));

      renderHook(() => useTheme());

      // Initially should be light (system preference is light)
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Verify that the listener was registered to respond to system changes
      expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );

      // Verify the listener is set up for the correct media query
      expect(window.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)'
      );
    });

    it('should not respond to system changes when theme is explicitly set', () => {
      matchMediaMock.matches = false;
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Try to trigger system change (but listener shouldn't be registered)
      matchMediaMock.matches = true;

      // Theme should remain light
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid theme switches', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
        result.current.setTheme('light');
        result.current.setTheme('system');
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should handle same theme being set multiple times', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      const addEventListenerCallCount =
        matchMediaMock.addEventListener.mock.calls.length;

      act(() => {
        result.current.setTheme('dark');
      });

      // Should not add duplicate listeners
      expect(matchMediaMock.addEventListener).toHaveBeenCalledTimes(
        addEventListenerCallCount
      );
    });
  });

  describe('schema validation', () => {
    it('should validate stored theme value with ThemeSchema', () => {
      localStorage.setItem('theme-preference', JSON.stringify('dark'));

      const { result } = renderHook(() => useTheme());

      // Should successfully validate and use the stored value
      expect(result.current.theme).toBe('dark');
    });

    it('should fall back to system when localStorage has invalid theme value', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Store an invalid theme value
      localStorage.setItem('theme-preference', JSON.stringify('invalid-theme'));

      const { result } = renderHook(() => useTheme());

      // Should fall back to default 'system' theme
      expect(result.current.theme).toBe('system');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('failed validation'),
        expect.any(Array)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should reject corrupted theme data and use default', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Store a completely wrong type
      localStorage.setItem('theme-preference', JSON.stringify(123));

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('system');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should accept all valid theme values', () => {
      const validThemes: Array<'light' | 'dark' | 'system'> = [
        'light',
        'dark',
        'system',
      ];

      validThemes.forEach((theme) => {
        localStorage.clear();
        localStorage.setItem('theme-preference', JSON.stringify(theme));

        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe(theme);
      });
    });

    it('should handle manually edited localStorage with typo', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Simulate user manually editing localStorage with a typo
      localStorage.setItem('theme-preference', JSON.stringify('drak')); // typo: 'drak' instead of 'dark'

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('system');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should validate theme after updates', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      // After setting, the value in localStorage should be valid
      const storedValue = localStorage.getItem('theme-preference');
      expect(storedValue).toBe(JSON.stringify('light'));
      expect(result.current.theme).toBe('light');
    });
  });
});
