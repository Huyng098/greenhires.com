import hashlib
import hmac
import logging
import random
import string
from typing import Any
from uuid import uuid4
from src.resume.schema import Resume
import pyotp
from asyncpg.pgproto import pgproto
from tenacity import RetryCallState
from src.sample.schema import (
    AboutMe,
    Awards,
    Certifications,
    Courses,
    Education,
    Experience,
    Hobbies,
    Languages,
    MetadataSection,
    ResumeData,
    ResumeSections,
    Skills,
)

logger = logging.getLogger(__name__)
ALPHA_NUM = string.ascii_letters + string.digits
ALPHA_UPPERCASE = string.ascii_uppercase + string.digits


def generate_random_alphanum(length: int = 20) -> str:
    return "".join(random.choices(ALPHA_NUM, k=length))


def generate_otp_secret(length: int = 6) -> str:
    secret_key = pyotp.random_base32()
    otp = pyotp.TOTP(secret_key, digits=length)
    return otp.now()


def generate_unique_code(prefix: str = "", length: int = 8) -> str:
    return f"{prefix}_".join(random.choices(ALPHA_UPPERCASE, k=length))


logger = logging.getLogger(__name__)


def my_before_sleep(retry_state: RetryCallState) -> None:
    if retry_state.attempt_number < 1:
        loglevel = logging.INFO
    else:
        loglevel = logging.WARNING
    logger.log(
        loglevel,
        "Retrying %s: attempt %s ended with: %s",
        retry_state.fn,
        retry_state.attempt_number,
        retry_state.outcome,
    )


def is_account_recipient(account_id: str, message: dict[str, Any]) -> bool:
    return account_id in message.get("recipient_ids")


def defaultDumpJson(obj) -> str:
    if isinstance(obj, pgproto.UUID):
        return str(obj)
    raise TypeError


def generate_payload(
    key: str, payload: dict[str, Any], fields: list[str]
) -> dict[str, Any]:
    """
    Generate MAC for ZaloPay request payload.

    Args:
    - payload (dict): The payload data.
    - key (str): The ZaloPay key to use for HMAC.

    Returns:
    - str: The generated MAC.
    """
    data = "|".join(str(payload.get(field, "")) for field in fields)
    payload["mac"] = hmac.new(key.encode(), data.encode(), hashlib.sha256).hexdigest()
    return payload


def mapping_resume_data(data: dict[str, Any]) -> ResumeData:
    basics = data.get("basics")
    sections = ResumeSections()
    sections_data = data.get("sections", {})
    for key, value in sections_data.items():
        if not value:
            continue

        section_metadata = {
            "visible": True,
            "columns": 1,
            "name": key.capitalize(),
            "key": key,
        }

        if key == "aboutme":
            section_metadata["content"] = value.get("content", "")
            setattr(sections, key, AboutMe(**section_metadata))
        else:
            if key != "projects":
                items = [
                    {"id": str(uuid4()), "visible": True, **item_data}
                    for item_data in value
                ]
            else:
                items = [
                    {
                        "id": str(uuid4()),
                        "visible": True,
                        **item_data,
                        "link": {"label": "", "href": item_data.get("link")},
                    }
                    for item_data in value
                ]
            section_metadata["items"] = items
            if key == "education":
                setattr(sections, key, Education(**section_metadata))
            elif key == "experience":
                setattr(sections, key, Experience(**section_metadata))
            elif key == "skills":
                setattr(sections, key, Skills(**section_metadata))
            elif key == "languages":
                setattr(sections, key, Languages(**section_metadata))
            elif key == "awards":
                setattr(sections, key, Awards(**section_metadata))
            elif key == "hobbies":
                setattr(sections, key, Hobbies(**section_metadata))
            elif key == "courses":
                setattr(sections, key, Courses(**section_metadata))
            elif key == "certifications":
                setattr(sections, key, Certifications(**section_metadata))
    resume_data = ResumeData(
        basics=basics,
        sections=sections,
        metadata=MetadataSection(
            template="Template 1",
            section_order=[
                "education",
                "experience",
                "skills",
                "languages",
                "awards",
                "courses",
                "hobbies",
                "certifications",
                "references",
            ],
        ),
    )
    return resume_data


def get_resume_content(resume: Resume) -> str:
    content = []

    for key, data in resume.resume_data:
        if key == "sections":
            for section_key, section in data:
                if section_key == "aboutme":
                    content.append(str(section))
                elif section is not None:
                    if isinstance(section, dict):
                        for _, value in section.items():
                            content.append(f"{value.name}:")
                            if value.items:
                                content.extend(str(item) for item in value.items)
                    elif section.items:
                        content.append(f"{section.name}:")
                        content.extend(str(item) for item in section.items)
        else:
            content.append(str(data))
    print("content: ", content)
    content_str = "\n".join(content)
    return content_str
