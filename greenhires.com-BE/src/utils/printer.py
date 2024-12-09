import logging
import time
import orjson
import io
from src.utils.utils import get_resume_content, my_before_sleep
from src.external_service.aws import S3Instance
from src.resume.schema import Resume, ResumeData
from playwright.async_api import async_playwright
from src.config import settings
from src.sample.schema import Layers
from tenacity import retry, stop_after_attempt, wait_exponential
from pypdf import PdfReader, PdfWriter


def generateTXTFormat(resume: Resume) -> str:
    content_str = get_resume_content(resume)
    filepath = f"{resume.account_id}/resumes/{resume.id}.txt"
    resume_url = S3Instance.upload_object(content_str, filepath)
    return resume_url


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def generatePDFFormat(
    layers: list[Layers], resume_data: ResumeData
) -> io.BytesIO:
    start_time = time.time()
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page()
        # Enable console logging
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        json_data_str = orjson.dumps([layer.model_dump() for layer in layers]).decode()
        script = f"""
        (() => {{
            window.localStorage.setItem("resume_canva", JSON.stringify({json_data_str}));
            window.localStorage.setItem("resume_data", JSON.stringify({resume_data.model_dump_json() if resume_data else None}));
        }})();
        """
        await page.add_init_script(script)
        url = settings.PUBLIC_CLIENT_URL.replace("localhost", "host.docker.internal")
        await page.goto(
            f"{url}/artboard/preview", timeout=60000, wait_until="networkidle"
        )

        pagesBuffer: list[bytes] = []
        for index in range(len(layers)):
            pageElement = await page.query_selector(f'[data-page="{index + 1}"]')
            
            if pageElement is None:
                logging.error(f"Page element for index {index + 1} not found")
                continue  # Skip this page and move to the next one

            width = await (await pageElement.get_property("scrollWidth")).json_value()
            height = await (await pageElement.get_property("scrollHeight")).json_value()
            tempHtml = await page.evaluate(
                """(element) => {
                const clonedElement = element.cloneNode(true);
                const tempHtml = document.body.innerHTML;
                document.body.innerHTML = clonedElement.outerHTML;
                return tempHtml;
            }""",
                pageElement,
            )

            pagesBuffer.append(
                await page.pdf(
                    width=str(width),
                    height=str(height),
                    print_background=True,
                    prefer_css_page_size=True,
                )
            )
            await page.evaluate(
                """(tempHtml) => {
                document.body.innerHTML = tempHtml;
            }""",
                tempHtml,
            )
        # Merge all pages into one PDF
        pdf = PdfWriter()
        for page_buffer in pagesBuffer:
            pdf_reader = PdfReader(io.BytesIO(page_buffer))
            pdf.add_page(pdf_reader.pages[0])

        pdf_bytesio = io.BytesIO()
        pdf.write(pdf_bytesio)
        pdf_bytesio.seek(0)

        await page.close()
        await browser.close()
        logging.info(f"Chrome took {(time.time() - start_time)}s to print resume PDF")
        return pdf_bytesio


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    before_sleep=my_before_sleep,
)
async def generatePreview(
    layers: list[Layers], isAllPage: bool = False, color: str = None
) -> list[io.BytesIO]:
    start_time = time.time()
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page()
        # Enable console logging
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        json_layer_str = orjson.dumps([layer.model_dump() for layer in layers]).decode()
        script = f"""
        (() => {{
            const data = {json_layer_str};
            window.localStorage.setItem("resume_canva", JSON.stringify(data));
        }})();
        """
        await page.add_init_script(script)
        url = settings.PUBLIC_CLIENT_URL.replace("localhost", "host.docker.internal")
        await page.goto(
            f"{url}/artboard/preview", timeout=60000, wait_until="networkidle"
        )

        allScreenshots: list[io.BytesIO] = []

        if not isAllPage:
            await page.set_viewport_size({"width": 794, "height": 1123})
            buffer = await page.screenshot(quality=100, type="jpeg")
            allScreenshots.append(io.BytesIO(buffer))
        else:
            # Adjust viewport size
            await page.set_viewport_size({"width": 794, "height": 1123})
            for index in range(len(layers)):
                pageElement = await page.query_selector(f'[data-page="{index + 1}"]')
                buffer = await pageElement.screenshot(quality=100, type="jpeg")
                allScreenshots.append(io.BytesIO(buffer))
        await page.close()
        await browser.close()
    logging.info(f"Chrome took {(time.time() - start_time)}s to preview resume")
    return allScreenshots
