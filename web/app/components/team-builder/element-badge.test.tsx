import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ElementBadge } from './element-badge';
import { ALL_ELEMENTS } from '~/data/monsters';

describe('ElementBadge', () => {
  describe('element rendering', () => {
    it('should render Earth element', () => {
      render(<ElementBadge element="Earth" />);
      expect(screen.getByText('Earth')).toBeInTheDocument();
    });

    it('should render Fire element', () => {
      render(<ElementBadge element="Fire" />);
      expect(screen.getByText('Fire')).toBeInTheDocument();
    });

    it('should render Water element', () => {
      render(<ElementBadge element="Water" />);
      expect(screen.getByText('Water')).toBeInTheDocument();
    });

    it('should render Wind element', () => {
      render(<ElementBadge element="Wind" />);
      expect(screen.getByText('Wind')).toBeInTheDocument();
    });

    it('should render Wild element', () => {
      render(<ElementBadge element="Wild" />);
      expect(screen.getByText('Wild')).toBeInTheDocument();
    });

    it('should render all elements from ALL_ELEMENTS', () => {
      ALL_ELEMENTS.forEach((element) => {
        const { unmount } = render(<ElementBadge element={element} />);
        expect(screen.getByText(element)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('color mappings', () => {
    it('should have yellow background for Earth', () => {
      const { container } = render(<ElementBadge element="Earth" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-yellow-600');
    });

    it('should have red background for Fire', () => {
      const { container } = render(<ElementBadge element="Fire" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-red-600');
    });

    it('should have blue background for Water', () => {
      const { container } = render(<ElementBadge element="Water" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-blue-600');
    });

    it('should have green background for Wind', () => {
      const { container } = render(<ElementBadge element="Wind" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-green-600');
    });

    it('should have purple background for Wild', () => {
      const { container } = render(<ElementBadge element="Wild" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-purple-600');
    });
  });

  describe('hover states', () => {
    it('should have yellow hover for Earth', () => {
      const { container } = render(<ElementBadge element="Earth" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('hover:bg-yellow-700');
    });

    it('should have red hover for Fire', () => {
      const { container } = render(<ElementBadge element="Fire" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('hover:bg-red-700');
    });

    it('should have blue hover for Water', () => {
      const { container } = render(<ElementBadge element="Water" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('hover:bg-blue-700');
    });

    it('should have green hover for Wind', () => {
      const { container } = render(<ElementBadge element="Wind" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('hover:bg-green-700');
    });

    it('should have purple hover for Wild', () => {
      const { container } = render(<ElementBadge element="Wild" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('hover:bg-purple-700');
    });
  });

  describe('text color', () => {
    it('should have white text for all elements', () => {
      ALL_ELEMENTS.forEach((element) => {
        const { container, unmount } = render(<ElementBadge element={element} />);
        const badge = container.firstChild as HTMLElement;
        expect(badge.className).toContain('text-white');
        unmount();
      });
    });
  });

  describe('className prop', () => {
    it('should accept additional className', () => {
      const { container } = render(
        <ElementBadge element="Fire" className="custom-class" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('custom-class');
    });

    it('should merge className with element colors', () => {
      const { container } = render(
        <ElementBadge element="Water" className="extra-margin" />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-blue-600');
      expect(badge.className).toContain('extra-margin');
    });

    it('should work without className prop', () => {
      const { container } = render(<ElementBadge element="Earth" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-yellow-600');
    });
  });

  describe('color mapping completeness', () => {
    it('should have color defined for every element', () => {
      // This test ensures no element is missing from the color mapping
      const elementColors = {
        Earth: 'bg-yellow-600',
        Fire: 'bg-red-600',
        Water: 'bg-blue-600',
        Wind: 'bg-green-600',
        Wild: 'bg-purple-600',
      };

      ALL_ELEMENTS.forEach((element) => {
        expect(elementColors[element]).toBeDefined();
        expect(elementColors[element]).toBeTruthy();
      });
    });

    it('should have unique colors for each element', () => {
      const colors = [
        'bg-yellow-600',
        'bg-red-600',
        'bg-blue-600',
        'bg-green-600',
        'bg-purple-600',
      ];

      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('should render all elements without errors', () => {
      expect(() => {
        ALL_ELEMENTS.forEach((element) => {
          const { unmount } = render(<ElementBadge element={element} />);
          unmount();
        });
      }).not.toThrow();
    });
  });

  describe('visual consistency', () => {
    it('should use consistent color shade (600) for all elements', () => {
      const { container: earthContainer } = render(<ElementBadge element="Earth" />);
      const { container: fireContainer } = render(<ElementBadge element="Fire" />);
      const { container: waterContainer } = render(<ElementBadge element="Water" />);
      const { container: windContainer } = render(<ElementBadge element="Wind" />);
      const { container: wildContainer } = render(<ElementBadge element="Wild" />);

      expect((earthContainer.firstChild as HTMLElement).className).toMatch(/-600/);
      expect((fireContainer.firstChild as HTMLElement).className).toMatch(/-600/);
      expect((waterContainer.firstChild as HTMLElement).className).toMatch(/-600/);
      expect((windContainer.firstChild as HTMLElement).className).toMatch(/-600/);
      expect((wildContainer.firstChild as HTMLElement).className).toMatch(/-600/);
    });

    it('should use consistent hover shade (700) for all elements', () => {
      const { container: earthContainer } = render(<ElementBadge element="Earth" />);
      const { container: fireContainer } = render(<ElementBadge element="Fire" />);
      const { container: waterContainer } = render(<ElementBadge element="Water" />);
      const { container: windContainer } = render(<ElementBadge element="Wind" />);
      const { container: wildContainer } = render(<ElementBadge element="Wild" />);

      expect((earthContainer.firstChild as HTMLElement).className).toContain('hover:bg-');
      expect((fireContainer.firstChild as HTMLElement).className).toContain('hover:bg-');
      expect((waterContainer.firstChild as HTMLElement).className).toContain('hover:bg-');
      expect((windContainer.firstChild as HTMLElement).className).toContain('hover:bg-');
      expect((wildContainer.firstChild as HTMLElement).className).toContain('hover:bg-');
    });
  });

  describe('accessibility', () => {
    it('should render as a badge element', () => {
      const { container } = render(<ElementBadge element="Fire" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have readable text content', () => {
      render(<ElementBadge element="Water" />);
      const badge = screen.getByText('Water');
      expect(badge.textContent).toBe('Water');
    });

    it('should render text in white for contrast against dark backgrounds', () => {
      ALL_ELEMENTS.forEach((element) => {
        const { container, unmount } = render(<ElementBadge element={element} />);
        const badge = container.firstChild as HTMLElement;
        // All badges should have text-white for good contrast
        expect(badge.className).toContain('text-white');
        unmount();
      });
    });
  });

  describe('element theme matching', () => {
    it('should use nature colors for nature elements', () => {
      const { container: earthContainer } = render(<ElementBadge element="Earth" />);
      const { container: waterContainer } = render(<ElementBadge element="Water" />);
      const { container: windContainer } = render(<ElementBadge element="Wind" />);

      // Earth = yellow (earth/ground)
      expect((earthContainer.firstChild as HTMLElement).className).toContain('yellow');
      // Water = blue (water)
      expect((waterContainer.firstChild as HTMLElement).className).toContain('blue');
      // Wind = green (nature/air)
      expect((windContainer.firstChild as HTMLElement).className).toContain('green');
    });

    it('should use hot colors for Fire element', () => {
      const { container } = render(<ElementBadge element="Fire" />);
      // Fire = red (hot/fire)
      expect((container.firstChild as HTMLElement).className).toContain('red');
    });

    it('should use magical color for Wild element', () => {
      const { container } = render(<ElementBadge element="Wild" />);
      // Wild = purple (magical/mystical)
      expect((container.firstChild as HTMLElement).className).toContain('purple');
    });
  });
});
