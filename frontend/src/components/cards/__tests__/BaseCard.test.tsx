import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import {
  CustomLinkCard,
  CustomOnClickCard,
  CardImage,
  CardTitle
} from '@/components/cards/BaseCard';

test('renders CustomLinkCard with children and link', () => {
  render(
    <MemoryRouter>
      <CustomLinkCard link="/test-link" className="test-class">
        <div>Test Content</div>
      </CustomLinkCard>
    </MemoryRouter>
  );

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/test-link');
  expect(link).toHaveClass('test-class');
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});

test('renders CustomOnClickCard and handles click', () => {
  const handleClick = jest.fn();

  render(
    <CustomOnClickCard onClick={handleClick} className="test-class">
      <div>Test Content</div>
    </CustomOnClickCard>
  );

  const card = screen.getByText('Test Content');
  expect(card).toBeInTheDocument();

  const cardContainer = card.closest('.test-class');
  expect(cardContainer).toHaveClass('test-class');

  fireEvent.click(card);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('renders CardImage with correct attributes', () => {
  render(
    <CardImage
      imageSrc="/test.jpg"
      altText="Test Alt"
      divClassName="test-div-class"
      imgClassName="test-img-class"
    />
  );

  const image = screen.getByRole('img');
  expect(image).toHaveAttribute('src', '/test.jpg');
  expect(image).toHaveAttribute('alt', 'Test Alt');
  expect(image).toHaveClass('test-img-class');

  const container = image.closest('div');
  expect(container).toHaveClass('test-div-class');
});

test('renders CardTitle with correct text and class', () => {
  render(<CardTitle title="Test Title" className="test-class" />);

  const title = screen.getByText('Test Title');
  expect(title).toBeInTheDocument();
  expect(title).toHaveClass('test-class');
});