import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameCard, ImageGameCard, RevealGameCard, TextGameCard } from '../GameCard';

describe('GameCard Components', () => {
  describe('GameCard', () => {
    it('renders children correctly', () => {
      render(
        <GameCard>
          <div>Test Content</div>
        </GameCard>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <GameCard className="custom-class" data-testid="game-card">
          <div>Test</div>
        </GameCard>
      );
      const card = screen.getByTestId('game-card');
      expect(card).toHaveClass('custom-class');
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(
        <GameCard onClick={handleClick}>
          <div>Click Me</div>
        </GameCard>
      );
      screen.getByText('Click Me').click();
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('ImageGameCard', () => {
    it('shows number when not revealed', () => {
      render(
        <ImageGameCard
          imageUrl="test.jpg"
          imageAlt="Test"
          number={1}
          revealed={false}
        >
          <div>Content</div>
        </ImageGameCard>
      );
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('shows image when revealed', () => {
      render(
        <ImageGameCard
          imageUrl="test.jpg"
          imageAlt="Test"
          revealed={true}
        >
          <div>Content</div>
        </ImageGameCard>
      );
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'test.jpg');
      expect(img).toHaveAttribute('alt', 'Test');
    });

    it('shows text overlay when revealed with text prop', () => {
      render(
        <ImageGameCard
          imageUrl="test.jpg"
          imageAlt="Test"
          text="Answer text"
          revealed={true}
        >
          <div>Content</div>
        </ImageGameCard>
      );
      expect(screen.getByText('Answer text')).toBeInTheDocument();
    });

    it('handles image error', () => {
      render(
        <ImageGameCard
          imageUrl="nonexistent.jpg"
          imageAlt="Test"
          revealed={true}
        >
          <div>Content</div>
        </ImageGameCard>
      );
      const img = screen.getByRole('img');
      
      // Simulate error event
      const errorEvent = new Event('error');
      img.dispatchEvent(errorEvent);
      
      expect(img).toHaveAttribute('src', '/placeholder.svg');
    });
  });

  describe('RevealGameCard', () => {
    it('shows icon when revealed', () => {
      render(
        <RevealGameCard
          revealed={true}
          icon={<span>Icon</span>}
        >
          <div>Content</div>
        </RevealGameCard>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    it('applies custom colors when revealed', () => {
      render(
        <RevealGameCard
          revealed={true}
          backgroundColor="bg-red-500"
          data-testid="reveal-card"
        >
          <div>Content</div>
        </RevealGameCard>
      );
      const card = screen.getByTestId('reveal-card');
      expect(card).toHaveClass('bg-red-500');
    });
  });

  describe('TextGameCard', () => {
    it('shows text when not revealed', () => {
      render(
        <TextGameCard
          text="Hidden Text"
          revealed={false}
        >
          <div>Content</div>
        </TextGameCard>
      );
      expect(screen.getByText('Hidden Text')).toBeInTheDocument();
    });

    it('hides text when revealed', () => {
      render(
        <TextGameCard
          text="Hidden Text"
          revealed={true}
        >
          <div>Content</div>
        </TextGameCard>
      );
      expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
    });

    it('applies custom font styles', () => {
      render(
        <TextGameCard
          text="Styled Text"
          fontSize="text-2xl"
          fontWeight="font-bold"
          revealed={false}
        >
          <div>Content</div>
        </TextGameCard>
      );
      const text = screen.getByText('Styled Text');
      expect(text).toHaveClass('text-2xl', 'font-bold');
    });
  });
});
