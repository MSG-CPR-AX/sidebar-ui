from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox"]  # Add this flag
        )
        page = browser.new_page()

        page.goto("http://localhost:5173")

        # Wait for the new, simplified content
        page.wait_for_selector('h2:has-text("Hello from ContentView")')

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/simplified_layout.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
