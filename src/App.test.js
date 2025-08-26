import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading state and then main content', async () => {
  render(<App />);

  // Check for the initial loading state
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  // Wait for the mock data to load and check for a top-level folder
  const mainContent = await screen.findByText(/DevOps/i);
  expect(mainContent).toBeInTheDocument();
});
