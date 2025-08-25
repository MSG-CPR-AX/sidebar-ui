import os
from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Point to the local built file
        file_path = "file://" + os.path.abspath("dist/index.html")
        page.goto(file_path)

        # Wait for the list to appear, which indicates data has loaded from MSW
        # Note: MSW should still work as the service worker is registered and copied
        page.wait_for_selector('div:has-text("React Official Docs")', timeout=10000)

        # Give a little extra time for fonts/styles to settle
        page.wait_for_timeout(1000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/final_ui_screenshot.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
