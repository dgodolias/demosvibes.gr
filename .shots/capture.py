"""Capture screenshots of the live videos site for visual QA."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent
SHOTS = [
    ("landing-desktop",  "https://dgodolias.github.io/videos/",          1280, 800),
    ("cvtailor-desktop", "https://dgodolias.github.io/videos/cv-tailor/", 1280, 900),
    ("landing-mobile",   "https://dgodolias.github.io/videos/",           390,  844),
    ("cvtailor-mobile",  "https://dgodolias.github.io/videos/cv-tailor/", 390,  900),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, url, w, h in SHOTS:
        ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=2)
        page = ctx.new_page()
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(800)
        out = OUT / f"{name}.png"
        page.screenshot(path=str(out), full_page=True)
        ctx.close()
        print(f"saved {out}")
    browser.close()
