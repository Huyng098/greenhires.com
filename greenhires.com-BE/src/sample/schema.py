from datetime import datetime
from io import BytesIO
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Any
from uuid import UUID, uuid4
from enum import Enum
from pydantic_extra_types.color import Color
from src.schema import BaseSchema, Status

import html2text
parser = html2text.HTML2Text()
parser.emphasis_mark = ""
parser.strong_mark = ""


# Enums


class ResumeType(str, Enum):
    resume = "resume"
    coverletter = "cover-letter"


class BuilderType(str, Enum):
    resumeio = "resumeio"
    resumecanva = "resumecanva"


class DisplayBarEnum(str, Enum):
    star = "star"
    circle = "circle"
    heart = "heart"
    triangle = "triangle"


class PageTypeEnum(str, Enum):
    a4 = "a4"
    letter = "letter"


class ResumeVisibilityEnum(str, Enum):
    public = "public"
    private = "private"


class SampleType(str, Enum):
    TEMPLATE = "template"
    LAYOUT = "layout"
    TEMPLATE_LAYOUT = "template-layout"
    COVERLETTER = "cover-letter"

class ExportType(str, Enum):
    PDF = "pdf",
    TXT = "txt",


class SubFont(BaseModel):
    urls: list[str]
    style: Optional[str] = None


class Font(BaseSchema):
    name: str
    fonts: list[SubFont]


class BoxSize(BaseModel):
    width: float
    height: float


class Delta(BaseModel):
    x: float
    y: float


class Frame(BaseSchema):
    img: str
    clipPath: str
    width: int
    height: int


class SerializedCompType(BaseModel):
    resolvedName: str


class SerializedLayer(BaseModel):
    type: SerializedCompType
    props: dict[str, Any]
    locked: bool
    parent: Optional[str] = None
    child: Optional[list[str]] = None


class BoxData(BaseModel):
    boxSize: BoxSize
    position: Delta
    rotate: float
    scale: Optional[float] = None


class Layers(BaseModel):
    layers: dict[str, SerializedLayer]
    rootId: Optional[str] = None


# Base Section

class BaseSection(BaseModel):
    name: str = None
    columns: int = Field(default=1)
    visible: bool = Field(default=True)
    key: str = Field(default=None)


# About Me
class AboutMe(BaseSection):
    content: str = Field(default="")

    def __str__(self):
        return f"\n{self.name}: \n{parser.handle(self.content)}"


# Education

class BaseSubSection(BaseModel):
    id: str = Field(default=str(uuid4()))
    visible: bool = Field(default=True)



class SubEducation(BaseSubSection):
    school: str = Field(default="")
    typeOfStudy: str = Field(default="")
    major: str = Field(default="")
    score: str = Field(default="")
    yearGraduation: str = Field(default="")
    summary: str = Field(default="")

    def __str__(self):
        return f"""    Study at {self.school} in {self.typeOfStudy} major
    Score: {self.score} - Graduation year: {self.yearGraduation}
    Summary: {parser.handle(self.summary)}"""


class Education(BaseSection):
    items: Optional[list[SubEducation]] = []


# Experience


class SubExperience(BaseSubSection):
    company: Optional[str] = None
    position: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    summary: Optional[str] = None

    def __str__(self):
        return f"""    Work at {self.company} as {self.position}
    From {self.startDate} to {self.endDate}
    Summary: {parser.handle(self.summary)}"""


class Experience(BaseSection):
    items: Optional[list[SubExperience]] = []


# Skills


class SubSkill(BaseSubSection):
    name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[int] = None
    displayBar: Optional[DisplayBarEnum] = DisplayBarEnum.star

    @field_validator("level")
    @classmethod
    def validate_level(cls, value):
        if value == 0:
            return None
        elif value not in range(1, 6):
            raise ValueError("Level must be in range 1-5")
        return value

    def __str__(self):
        return f"""    Skill: {self.name}
    Description: {self.description}
    Level: {self.level}"""


class Skills(BaseSection):
    items: Optional[list[SubSkill]] = []


# Languages


class SubLanguage(BaseSubSection):
    name: Optional[str] = None
    summary: Optional[str] = None
    level: Optional[int] = None

    @field_validator("level")
    @classmethod
    def validate_level(cls, value):
        if value == 0:
            return None
        elif value not in range(1, 6):
            raise ValueError("Level must be in range 1-5")
        return value

    def __str__(self):
        return f"""    Language: {self.name}
    Summary: {self.summary}
    Level: {self.level}"""


class Languages(BaseSection):
    items: Optional[list[SubLanguage]] = []


# Awards


class SubAward(BaseSubSection):
    title: Optional[str] = None
    date: Optional[str] = None
    awarder: Optional[str] = None
    summary: Optional[str] = None

    def __str__(self):
        return f"""    Award: {self.title} - {self.date}
    Awarder: {self.awarder}
    Summary: {parser.handle(self.summary)}"""


class Awards(BaseSection):
    items: Optional[list[SubAward]] = []


# Hobbies
class SubHobby(BaseSubSection):
    name: Optional[str] = None
    summary: Optional[str] = None

    def __str__(self):
        return f"""    Hobby: {self.name}
    Summary: {parser.handle(self.summary)}"""


class Hobbies(BaseSection):
    items: Optional[list[SubHobby]] = []


# Courses


class SubCourse(BaseSubSection):
    name: Optional[str] = None
    institution: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None

    def __str__(self):
        return f"""    Course: {self.name} at {self.institution}
    From {self.startDate} to {self.endDate}"""


class Courses(BaseSection):
    items: Optional[list[SubCourse]] = []


# Certifications


class SubCertification(BaseSubSection):
    title: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    summary: Optional[str] = None

    def __str__(self):
        return f"""    Certification: {self.title} - {self.date}
    Issuer: {self.issuer}
    Summary: {parser.handle(self.summary)}"""


class Certifications(BaseSection):
    items: Optional[list[SubCertification]] = []


# References
class SubReference(BaseSubSection):
    name: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

    def __str__(self):
        return f"""    Reference: {self.name}
    Position: {self.position}
    Company: {self.company}
    Phone: {self.phone}
    Email: {self.email}"""


class References(BaseSection):
    items: Optional[list[SubReference]] = []


class SubLink(BaseSubSection):
    label: Optional[str] = None
    href: Optional[str]

    def __str__(self):
        return f"{self.label}: {self.href}"


class Links(BaseSection):
    items: Optional[list[SubLink]] = []


# Custom Sections


class SubCustomSection(BaseSubSection):
    name: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    summary: Optional[str] = None

    def __str__(self):
        return f"""    Name: {self.name} - from {self.startDate} to {self.endDate}
    Summary: {parser.handle(self.summary)}
    """


class CustomSection(BaseSection):
    items: Optional[list[SubCustomSection]] = []


# Resume Sections

class BasicInformation(BaseModel):
    name: str = Field(default="Personal Details")
    firstname: str = Field(default="")
    headline: str = Field(default="")
    lastname: str = Field(default="")
    email: str = Field(default="")
    phone: str = Field(default="")
    country: str = Field(default="")
    city: str = Field(default="")
    address: str = Field(default="")
    picture: str = Field(default="")
    cover_picture: str = Field(default="")

    def __str__(self):
        return f"""{self.name}:
    Fullname: {parser.handle(f"{self.firstname} {self.lastname}")}
    Email: {parser.handle(self.email)}
    Phone: {parser.handle(self.phone)}
    Address: {parser.handle(f"{self.address} {self.city} {self.country}")}
"""


# Resume Sections Schema


class ResumeSections(BaseModel):
    aboutme: Optional[AboutMe] = None
    education: Optional[Education] = None
    experience: Optional[Experience] = None
    skills: Optional[Skills] = None
    links: Optional[Links] = None
    languages: Optional[Languages] = None
    awards: Optional[Awards] = None
    hobbies: Optional[Hobbies] = None
    courses: Optional[Courses] = None
    references: Optional[References] = None
    certifications: Optional[Certifications] = None
    custom: Optional[dict[str, CustomSection]] = None


# Resume Schema


class MetadataSection(BaseModel):
    template: str
    variant: str = ""
    section_order: list[str]

class ResumeData(BaseModel):
    basics: Optional[BasicInformation] = None
    sections: Optional[ResumeSections] = None
    metadata: Optional[MetadataSection] = None
    css: Optional[str] = Field(None, exclude=False, description="CSS styles for customization")

class SampleCreate(BaseModel):
    name: str
    type: Optional[SampleType] = None
    resume_canva: Optional[list[Layers]] = None
    resume_data: Optional[ResumeData] = None


class SampleUpdate(BaseModel):
    name: Optional[str] = None
    resume_canva: Optional[list[Layers]] = None
    resume_data: Optional[ResumeData] = None


class SampleVariantCreate(BaseModel):
    color: str

    @field_validator("color")
    @classmethod
    def validate_color(cls, v):
        if v:
            if v == "default":
                return v
            try:
                Color(v)
            except ValueError:
                raise ValueError(f"Invalid color: {v}")
        return v


class SampleVariant(BaseSchema):
    imgs: Optional[list[str]] = None
    color: Optional[str] = None
    sample_id: Optional[UUID] = None


class Sample(SampleCreate, BaseSchema):
    approver_name: Optional[str] = None
    status: Optional[Status] = None
    category_ids: Optional[list[UUID | None]] = None
    creator_id: Optional[UUID] = None
    category_names: Optional[list[str | None]] = None
    due_date: Optional[datetime] = None
    comments: Optional[list[dict[str, Any]]] = None
    creator_name: Optional[str] = None
    variants: Optional[list[SampleVariant]] = None

    @field_validator("category_ids", "category_names")
    @classmethod
    def reformat(cls, v):
        if v and v[0] is None:
            return None
        return v


class SampleStatusUpdate(BaseModel):
    status: Optional[Status] = None
    category_ids: Optional[list[UUID]] = None
    comment: Optional[str] = None
    due_date: Optional[datetime] = None


class TextStyles(BaseSchema):
    img: str
    elements: Layers


class SVGImage(BaseModel):
    id: int
    downloadUrl: str
    thumb: str


class UnsplashImage(BaseModel):
    id: str
    image: str
    name: str
    thumb: str
    height: int
    width: int
    username: str


class SampleImport(BaseModel):
    name: str
    sample_id: str
