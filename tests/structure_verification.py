from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        
        if not os.path.exists("docs"):
            os.makedirs("docs")

        print("Navigating to Home...")
        try:
            page.goto('http://localhost:5173', timeout=30000)
            # Wait for network idle to ensure JS loaded
            page.wait_for_load_state('networkidle')
            
            title = page.title()
            print(f"Home Title: {title}")
            
            # Check for language toggle button which indicates main.js ran
            try:
                page.wait_for_selector('.lang-btn', timeout=5000)
                print("SUCCESS: Main page loaded and script executed (Language buttons found).")
            except:
                print("WARNING: Main page loaded but .lang-btn not found.")
                
            page.screenshot(path='docs/qa_home.png')
            
        except Exception as e:
            print(f"FAILED to load Home: {e}")

        print("Navigating to Guidelines...")
        try:
            page.goto('http://localhost:5173/guideline/', timeout=30000)
            page.wait_for_load_state('networkidle')
            
            # Check for 'Production Guidelines' text which is rendered by React
            try:
                if page.get_by_text("Production Guidelines").count() > 0:
                     print("SUCCESS: Guideline page loaded (React App mounted).")
                else:
                     print("WARNING: Guideline page loaded but text not found.")
            except:
                print("WARNING: Guideline page inspection failed.")

            page.screenshot(path='docs/qa_guideline.png')
            
        except Exception as e:
            print(f"FAILED to load Guidelines: {e}")
            
        browser.close()

if __name__ == "__main__":
    run()
