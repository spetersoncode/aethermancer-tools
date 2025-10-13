import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CollectionStats } from './collection-stats';

describe('CollectionStats', () => {
  describe('percentage calculation', () => {
    it('should calculate 0% for empty collection', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={0}
          totalBase={50}
          collectedBase={0}
          totalShifted={50}
          collectedShifted={0}
        />
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should calculate 100% for complete collection', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={100}
          totalBase={50}
          collectedBase={50}
          totalShifted={50}
          collectedShifted={50}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should calculate 50% for half collection', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={50}
          totalBase={50}
          collectedBase={25}
          totalShifted={50}
          collectedShifted={25}
        />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should round percentage correctly', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={27}
          totalBase={27}
          collectedBase={13}
          totalShifted={27}
          collectedShifted={14}
        />
      );

      // 27/54 = 0.5 = 50%
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should round up when needed', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={67}
          totalBase={50}
          collectedBase={33}
          totalShifted={50}
          collectedShifted={34}
        />
      );

      // 67/100 = 67%
      expect(screen.getByText('67%')).toBeInTheDocument();
    });

    it('should round down when needed', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={33}
          totalBase={50}
          collectedBase={16}
          totalShifted={50}
          collectedShifted={17}
        />
      );

      // 33/100 = 33%
      expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('should handle decimal percentages correctly', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={18}
          totalBase={27}
          collectedBase={9}
          totalShifted={27}
          collectedShifted={9}
        />
      );

      // 18/54 = 0.333... = 33%
      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle division by zero (no total monsters)', () => {
      render(
        <CollectionStats
          totalMonsters={0}
          collectedCount={0}
          totalBase={0}
          collectedBase={0}
          totalShifted={0}
          collectedShifted={0}
        />
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle single monster collection', () => {
      render(
        <CollectionStats
          totalMonsters={1}
          collectedCount={1}
          totalBase={1}
          collectedBase={1}
          totalShifted={0}
          collectedShifted={0}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should handle very large numbers', () => {
      render(
        <CollectionStats
          totalMonsters={10000}
          collectedCount={5000}
          totalBase={5000}
          collectedBase={2500}
          totalShifted={5000}
          collectedShifted={2500}
        />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should handle 1 out of large total', () => {
      render(
        <CollectionStats
          totalMonsters={1000}
          collectedCount={1}
          totalBase={500}
          collectedBase={1}
          totalShifted={500}
          collectedShifted={0}
        />
      );

      // 1/1000 = 0.1% rounds to 0%
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('display content', () => {
    it('should display "Collection Progress" title', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={50}
          totalBase={50}
          collectedBase={25}
          totalShifted={50}
          collectedShifted={25}
        />
      );

      expect(screen.getByText('Collection Progress')).toBeInTheDocument();
    });

    it('should display "Overall" label', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={50}
          totalBase={50}
          collectedBase={25}
          totalShifted={50}
          collectedShifted={25}
        />
      );

      expect(screen.getByText('Overall')).toBeInTheDocument();
    });

    it('should display collected count and total', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={50}
          totalBase={50}
          collectedBase={25}
          totalShifted={50}
          collectedShifted={25}
        />
      );

      expect(screen.getByText('50 / 100 collected')).toBeInTheDocument();
    });

    it('should display base monsters stats', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={50}
          totalBase={50}
          collectedBase={25}
          totalShifted={50}
          collectedShifted={25}
        />
      );

      expect(screen.getByText('Base Monsters')).toBeInTheDocument();
      const stats = screen.getAllByText('25 / 50');
      expect(stats.length).toBeGreaterThan(0);
    });

    it('should display shifted variants stats', () => {
      render(
        <CollectionStats
          totalMonsters={100}
          collectedCount={50}
          totalBase={50}
          collectedBase={25}
          totalShifted={50}
          collectedShifted={25}
        />
      );

      expect(screen.getByText('Shifted Variants')).toBeInTheDocument();
      const stats = screen.getAllByText('25 / 50');
      expect(stats.length).toBeGreaterThan(0);
    });
  });

  describe('base monsters progress', () => {
    it('should calculate 0% base progress correctly', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={0}
          totalBase={27}
          collectedBase={0}
          totalShifted={27}
          collectedShifted={0}
        />
      );

      const stats = screen.getAllByText('0 / 27');
      expect(stats.length).toBe(2); // Both base and shifted will have 0 / 27
    });

    it('should calculate 100% base progress correctly', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={27}
          totalBase={27}
          collectedBase={27}
          totalShifted={27}
          collectedShifted={0}
        />
      );

      expect(screen.getByText('Base Monsters')).toBeInTheDocument();
      const baseStats = screen.getByText('27 / 27');
      expect(baseStats).toBeInTheDocument();
    });

    it('should handle partial base collection', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={15}
          totalBase={27}
          collectedBase={15}
          totalShifted={27}
          collectedShifted={0}
        />
      );

      expect(screen.getByText('Base Monsters')).toBeInTheDocument();
      expect(screen.getByText('15 / 27')).toBeInTheDocument();
    });
  });

  describe('shifted variants progress', () => {
    it('should calculate 0% shifted progress correctly', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={0}
          totalBase={27}
          collectedBase={0}
          totalShifted={27}
          collectedShifted={0}
        />
      );

      const stats = screen.getAllByText('0 / 27');
      expect(stats.length).toBe(2); // Both base and shifted
    });

    it('should calculate 100% shifted progress correctly', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={27}
          totalBase={27}
          collectedBase={0}
          totalShifted={27}
          collectedShifted={27}
        />
      );

      expect(screen.getByText('Shifted Variants')).toBeInTheDocument();
      const shiftedStats = screen.getByText('27 / 27');
      expect(shiftedStats).toBeInTheDocument();
    });

    it('should handle partial shifted collection', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={10}
          totalBase={27}
          collectedBase={0}
          totalShifted={27}
          collectedShifted={10}
        />
      );

      expect(screen.getByText('Shifted Variants')).toBeInTheDocument();
      expect(screen.getByText('10 / 27')).toBeInTheDocument();
    });
  });

  describe('asymmetric collection scenarios', () => {
    it('should handle all base collected, no shifted', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={27}
          totalBase={27}
          collectedBase={27}
          totalShifted={27}
          collectedShifted={0}
        />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('27 / 54 collected')).toBeInTheDocument();
    });

    it('should handle all shifted collected, no base', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={27}
          totalBase={27}
          collectedBase={0}
          totalShifted={27}
          collectedShifted={27}
        />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('27 / 54 collected')).toBeInTheDocument();
    });

    it('should handle more base than shifted', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={20}
          totalBase={27}
          collectedBase={15}
          totalShifted={27}
          collectedShifted={5}
        />
      );

      expect(screen.getByText('37%')).toBeInTheDocument();
      expect(screen.getByText('Base Monsters')).toBeInTheDocument();
      expect(screen.getByText('Shifted Variants')).toBeInTheDocument();
      expect(screen.getByText('15 / 27')).toBeInTheDocument();
      expect(screen.getByText('5 / 27')).toBeInTheDocument();
    });

    it('should handle more shifted than base', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={20}
          totalBase={27}
          collectedBase={5}
          totalShifted={27}
          collectedShifted={15}
        />
      );

      expect(screen.getByText('37%')).toBeInTheDocument();
      expect(screen.getByText('Base Monsters')).toBeInTheDocument();
      expect(screen.getByText('Shifted Variants')).toBeInTheDocument();
      expect(screen.getByText('5 / 27')).toBeInTheDocument();
      expect(screen.getByText('15 / 27')).toBeInTheDocument();
    });
  });

  describe('realistic game scenarios', () => {
    it('should handle Aethermancer starter state (4 starters collected)', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={4}
          totalBase={27}
          collectedBase={4}
          totalShifted={27}
          collectedShifted={0}
        />
      );

      // 4/54 = 7.4% rounds to 7%
      expect(screen.getByText('7%')).toBeInTheDocument();
      expect(screen.getByText('4 / 54 collected')).toBeInTheDocument();
    });

    it('should handle mid-game progress', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={30}
          totalBase={27}
          collectedBase={20}
          totalShifted={27}
          collectedShifted={10}
        />
      );

      // 30/54 = 55.5% rounds to 56%
      expect(screen.getByText('56%')).toBeInTheDocument();
      expect(screen.getByText('30 / 54 collected')).toBeInTheDocument();
    });

    it('should handle near-completion state', () => {
      render(
        <CollectionStats
          totalMonsters={54}
          collectedCount={53}
          totalBase={27}
          collectedBase={27}
          totalShifted={27}
          collectedShifted={26}
        />
      );

      // 53/54 = 98.1% rounds to 98%
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('53 / 54 collected')).toBeInTheDocument();
    });
  });
});
