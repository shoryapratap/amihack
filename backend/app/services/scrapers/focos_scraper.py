import re
from typing import Optional

class FoSCoSScraper:
    def __init__(
        self,
        search_url: str = "https://foscos.fssai.gov.in/",
        search_input: str = "",
        search_button: str = "",
        result_container: str = "",
        timeout: int = 30000
    ):
        self.search_url = search_url
        self.search_input = search_input
        self.search_button = search_button
        self.result_container = result_container
        self.timeout = timeout

    async def search(self, fssai_number: str) -> Optional[dict]:
        if not self.search_input or not self.search_button:
            return None

        try:
            from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
        except ImportError:
            return None

        async with async_playwright() as p:
            try:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()

                await page.goto(self.search_url, wait_until="domcontentloaded", timeout=self.timeout)
                await page.locator(self.search_input).wait_for(state="visible", timeout=self.timeout)
                await page.locator(self.search_input).fill(fssai_number)
                await page.locator(self.search_button).click()
                await page.wait_for_timeout(2000)

                if self.result_container:
                    result = page.locator(self.result_container)
                    await result.wait_for(state="visible", timeout=self.timeout)
                    text = await result.inner_text()
                else:
                    text = await page.locator("body").inner_text()

                return self._parse_result(text, fssai_number)
            except Exception:
                return None
            finally:
                try:
                    await browser.close()
                except Exception:
                    pass

    def _parse_result(self, text: str, fssai_number: str) -> Optional[dict]:
        if not text or fssai_number.lower() not in text.lower():
            return None

        organization_name = self._extract_value(
            text,
            ["Name of Company", "Company Name", "Organization Name", "Name"]
        )
        license_status = self._extract_value(
            text,
            ["License Status", "Status"]
        )

        return {
            "organization_name": organization_name,
            "license_status": license_status or "Active",
            "status": "verified",
            "raw_text": text
        }

    @staticmethod
    def _extract_value(text: str, labels: list[str]) -> Optional[str]:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        for index, line in enumerate(lines):
            lower_line = line.lower()
            for label in labels:
                if label.lower() in lower_line:
                    if ":" in line:
                        val = line.split(":", 1)[1].strip()
                        if val:
                            return val
                    if index + 1 < len(lines):
                        return lines[index + 1]
        return None
