import os
from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:5173", timeout=15000)

            # Wait for the main list element to prove the app has rendered data
            page.wait_for_selector('div:has-text("React Official Docs")', timeout=15000)

            # Give everything a moment to settle
            page.wait_for_timeout(2000)

            page.screenshot(path="jules-scratch/verification/final_screenshot.png")
            print("Screenshot captured successfully.")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
            # Take a screenshot even on error to see the state of the page
            page.screenshot(path="jules-scratch/verification/error_screenshot.png")
            print("Error screenshot captured.")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
