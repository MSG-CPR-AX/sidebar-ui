import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    # Get the absolute path to the index.html file
    # The script is in jules-scratch/verification, so we go up two levels
    # and then into dist/index.html
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.join(base_dir, '..', '..')
    index_html_path = os.path.join(project_root, 'dist', 'index.html')

    if not os.path.exists(index_html_path):
        raise FileNotFoundError(f"Could not find index.html at {index_html_path}. Please run 'npm run build' first.")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local built file
        page.goto(f'file://{index_html_path}')

        # Wait for the header to be visible
        header = page.get_by_role("banner")
        expect(header).to_be_visible()

        # The API call will fail, so we expect to see the error message
        # This still verifies that the app structure renders correctly
        error_message = page.get_by_text("Warning:")
        expect(error_message).to_be_visible(timeout=10000) # Give it time to fetch and fail

        # Take a screenshot of the initial rendered state
        screenshot_path = os.path.join(base_dir, 'verification.png')
        page.screenshot(path=screenshot_path)

        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run_verification()
