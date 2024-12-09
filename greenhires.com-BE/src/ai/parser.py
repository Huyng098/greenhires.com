from typing import Any
from src.ai.prompts import PARSING_PROMPT
from src.ai import client
import orjson
import pdftotext


class AIParser:
    @staticmethod
    def text_from_pdf(filepath: str) -> str:
        with open(filepath, "rb") as f:
            pdf = pdftotext.PDF(f)
        return "\n".join(pdf)

    @staticmethod
    def parse_resume(text: str) -> dict[str, Any]:
        chat_completion = client.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            temperature=0.0,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "You are a AI Parser that can parse resume data from text. You should return the parsed data in a JSON format that conforms to the provided schema.",
                },
                {
                    "role": "user",
                    "content": PARSING_PROMPT.format(resume_text=text),
                },
            ],
        )
        resume = orjson.loads(chat_completion.choices[0].message.content)
        return resume
