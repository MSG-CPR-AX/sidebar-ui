import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// This is now an integration test that checks the whole user flow.
describe('App Integration Test', () => {
  test('expands nested folders and shows children on click', async () => {
    render(<App />);

    // Wait for the app to finish loading the mock data.
    // We'll wait for the "DevOps" folder to appear.
    const devopsFolder = await screen.findByText('DevOps');
    expect(devopsFolder).toBeInTheDocument();

    // The "GitLab Docs" bookmark is deeply nested and should not be visible yet.
    expect(screen.queryByText('GitLab Docs')).not.toBeInTheDocument();

    // Click the top-level "DevOps" folder to open it.
    await userEvent.click(devopsFolder);

    // Now, the "GitLab" folder should be visible. Find and click it.
    const gitlabFolder = await screen.findByText('GitLab');
    await userEvent.click(gitlabFolder);

    // Now, the "GitLab Docs" bookmark should finally be visible.
    const gitlabDocsBookmark = await screen.findByText('GitLab Docs');
    expect(gitlabDocsBookmark).toBeInTheDocument();
  });
});
