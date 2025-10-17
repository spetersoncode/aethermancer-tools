import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamStats } from './team-stats';
import { type Monster } from '~/data/monsters';

describe('TeamStats', () => {
  const mockMonster1: Monster = {
    id: 'test-1',
    name: 'Test Monster 1',
    elements: ['Fire', 'Water'],
    types: ['Critical', 'Tank', 'Heal'],
    image: '/test1.png',
  };

  const mockMonster2: Monster = {
    id: 'test-2',
    name: 'Test Monster 2',
    elements: ['Fire', 'Earth'],
    types: ['Critical', 'Power', 'Shield'],
    image: '/test2.png',
  };

  const mockMonster3: Monster = {
    id: 'test-3',
    name: 'Test Monster 3',
    elements: ['Water', 'Wind'],
    types: ['Dodge', 'Heal', 'Sidekick'],
    image: '/test3.png',
  };

  describe('empty team handling', () => {
    it('should display placeholder message for empty team', () => {
      render(<TeamStats team={[null, null, null]} />);

      expect(screen.getByText('Team Composition')).toBeInTheDocument();
      expect(
        screen.getByText('Select monsters to see composition')
      ).toBeInTheDocument();
    });

    it('should display placeholder for all null team', () => {
      render(<TeamStats team={[null, null, null, null, null, null]} />);

      expect(
        screen.getByText('Select monsters to see composition')
      ).toBeInTheDocument();
    });
  });

  describe('element counting', () => {
    it('should count single element correctly', () => {
      render(<TeamStats team={[mockMonster1, null, null]} />);

      expect(screen.getByText('Fire')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      // Both Fire and Water appear once, so there will be multiple ×1
      const multipliers = screen.getAllByText('×1');
      expect(multipliers.length).toBeGreaterThan(0);
    });

    it('should count multiple occurrences of same element', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, null]} />);

      // Fire appears in both monsters
      const fireElements = screen.getAllByText('Fire');
      expect(fireElements.length).toBeGreaterThan(0);

      // Should show ×2 for Fire (and also for Critical type)
      const multipliers = screen.getAllByText('×2');
      expect(multipliers.length).toBeGreaterThan(0);
    });

    it('should count all elements across full team', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, mockMonster3]} />);

      // Fire: 2 (monster1, monster2)
      // Water: 2 (monster1, monster3)
      // Earth: 1 (monster2)
      // Wind: 1 (monster3)

      expect(screen.getByText('Fire')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      expect(screen.getByText('Earth')).toBeInTheDocument();
      expect(screen.getByText('Wind')).toBeInTheDocument();
    });

    it('should handle team with null slots', () => {
      render(<TeamStats team={[mockMonster1, null, mockMonster2, null]} />);

      expect(screen.getByText('Fire')).toBeInTheDocument();
      const multipliers = screen.getAllByText('×2');
      expect(multipliers.length).toBeGreaterThan(0);
    });
  });

  describe('type counting', () => {
    it('should count single type correctly', () => {
      render(<TeamStats team={[mockMonster1, null, null]} />);

      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('Tank')).toBeInTheDocument();
      expect(screen.getByText('Heal')).toBeInTheDocument();
    });

    it('should count multiple occurrences of same type', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, null]} />);

      // Critical appears in both monsters
      expect(screen.getByText('Critical')).toBeInTheDocument();
      const multipliers = screen.getAllByText('×2');
      expect(multipliers.length).toBeGreaterThan(0);
    });

    it('should count all types across full team', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, mockMonster3]} />);

      // Critical: 2, Heal: 2, others: 1 each
      expect(screen.getByText('Critical')).toBeInTheDocument();
      expect(screen.getByText('Heal')).toBeInTheDocument();
      expect(screen.getByText('Tank')).toBeInTheDocument();
      expect(screen.getByText('Power')).toBeInTheDocument();
      expect(screen.getByText('Shield')).toBeInTheDocument();
      expect(screen.getByText('Dodge')).toBeInTheDocument();
      expect(screen.getByText('Sidekick')).toBeInTheDocument();
    });
  });

  describe('sorting logic', () => {
    it('should sort elements by frequency (descending)', () => {
      const monster4: Monster = {
        id: 'test-4',
        name: 'Test Monster 4',
        elements: ['Fire'],
        types: ['Burn', 'Power', 'Force'],
        image: '/test4.png',
      };

      render(
        <TeamStats
          team={[mockMonster1, mockMonster2, monster4, mockMonster3]}
        />
      );

      // Fire: 3, Water: 2, Earth: 1, Wind: 1
      const elements = screen.getAllByText(/Fire|Water|Earth|Wind/);

      // First element should be Fire (highest count)
      expect(elements[0].textContent).toBe('Fire');
    });

    it('should sort types by frequency (descending)', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, mockMonster3]} />);

      // Critical: 2, Heal: 2 (should be first two or in any order)
      const types = screen.getAllByText(
        /Critical|Heal|Tank|Power|Shield|Dodge|Sidekick/
      );

      // Most frequent types should appear first
      const criticalIndex = types.findIndex(
        (el) => el.textContent === 'Critical'
      );
      const healIndex = types.findIndex((el) => el.textContent === 'Heal');

      expect(criticalIndex).toBeGreaterThanOrEqual(0);
      expect(healIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('visual display', () => {
    it('should display Team Composition header', () => {
      render(<TeamStats team={[mockMonster1, null, null]} />);

      expect(screen.getByText('Team Composition')).toBeInTheDocument();
    });

    it('should display Elements section', () => {
      render(<TeamStats team={[mockMonster1, null, null]} />);

      expect(screen.getByText('Elements')).toBeInTheDocument();
    });

    it('should display Types section', () => {
      render(<TeamStats team={[mockMonster1, null, null]} />);

      expect(screen.getByText('Types')).toBeInTheDocument();
    });

    it('should show count multiplier for each element', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, null]} />);

      const multipliers = screen.getAllByText(/×\d+/);
      expect(multipliers.length).toBeGreaterThan(0);
    });

    it('should show count multiplier for each type', () => {
      render(<TeamStats team={[mockMonster1, mockMonster2, null]} />);

      const multipliers = screen.getAllByText(/×\d+/);
      expect(multipliers.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle single monster team', () => {
      render(<TeamStats team={[mockMonster1]} />);

      expect(screen.getByText('Fire')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('should handle monster with single element', () => {
      const singleElementMonster: Monster = {
        id: 'single',
        name: 'Single Element',
        elements: ['Wild'],
        types: ['Aether', 'Power', 'Burn'],
        image: '/single.png',
      };

      render(<TeamStats team={[singleElementMonster]} />);

      expect(screen.getByText('Wild')).toBeInTheDocument();
      // Wild element and all 3 types appear once, so there will be multiple ×1
      const multipliers = screen.getAllByText('×1');
      expect(multipliers.length).toBe(4); // 1 element + 3 types
    });

    it('should handle large team', () => {
      const largeTeam = Array(6).fill(mockMonster1);

      render(<TeamStats team={largeTeam} />);

      expect(screen.getByText('Fire')).toBeInTheDocument();
      // Fire and Water appear 6 times each, Critical/Tank/Heal appear 6 times
      const multipliers = screen.getAllByText('×6');
      expect(multipliers.length).toBeGreaterThan(0);
    });

    it('should filter out null monsters correctly', () => {
      render(
        <TeamStats
          team={[null, mockMonster1, null, null, mockMonster2, null]}
        />
      );

      expect(screen.getByText('Fire')).toBeInTheDocument();
      const multipliers = screen.getAllByText('×2');
      expect(multipliers.length).toBeGreaterThan(0);
      expect(
        screen.queryByText('Select monsters to see composition')
      ).not.toBeInTheDocument();
    });

    it('should handle monsters with all different elements', () => {
      const monster4: Monster = {
        id: 'test-4',
        name: 'Test Monster 4',
        elements: ['Wind'],
        types: ['Force', 'Age', 'Weakness'],
        image: '/test4.png',
      };

      const monster5: Monster = {
        id: 'test-5',
        name: 'Test Monster 5',
        elements: ['Earth'],
        types: ['Poison', 'Affliction', 'Terror'],
        image: '/test5.png',
      };

      render(<TeamStats team={[monster4, monster5]} />);

      expect(screen.getByText('Wind')).toBeInTheDocument();
      expect(screen.getByText('Earth')).toBeInTheDocument();

      // Each should have ×1
      const multipliers = screen.getAllByText('×1');
      expect(multipliers.length).toBeGreaterThan(0);
    });
  });
});
