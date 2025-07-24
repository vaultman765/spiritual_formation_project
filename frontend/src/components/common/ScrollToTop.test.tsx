import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '@/components/common/ScrollToTop';

test('scrolls to top on route change', () => {
  window.scrollTo = jest.fn(); // Mock scrollTo function

  render(
    <MemoryRouter initialEntries={['/page1']}>
      <ScrollToTop />
      <Routes>
        <Route path="/page1" element={<div>Page 1</div>} />
        <Route path="/page2" element={<div>Page 2</div>} />
      </Routes>
    </MemoryRouter>
  );

  // Simulate route change
  render(
    <MemoryRouter initialEntries={['/page2']}>
      <ScrollToTop />
      <Routes>
        <Route path="/page2" element={<div>Page 2</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
});