import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main app container', () => {
  const { container } = render(<App />);
  const mainContainer = container.querySelector('.container');
  expect(mainContainer).toBeInTheDocument();
});
