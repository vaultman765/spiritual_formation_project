import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseCard from '@/components/cards/BaseCard';

test('renders BaseCard with all props', () => {
  render(
    <BaseCard
      title="Test Title"
      subtitle="Test Subtitle"
      imageSrc="/test.jpg"
      altText="Test Alt"
      link="/test-link"
      tag="Test Tag"
    />
  );

  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  expect(screen.getByText('Test Tag')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
  expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Alt');
});

test('navigates to link when clicked', () => {
  render(
    <BaseCard
      title="Test Title"
      subtitle="Test Subtitle"
      imageSrc="/test.jpg"
      altText="Test Alt"
      link="/test-link"
      tag="Test Tag"
    />
  );

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/test-link');
});