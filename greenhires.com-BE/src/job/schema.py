from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr
from src.schema import BaseSchema, Currency


class PostingStatus(str, Enum):
    draft = "draft"
    hidden = "hidden"
    posting = "posting"
    expired = "expired"


class SeniorityLevel(str, Enum):
    internship = "internship"
    entry = "entry"
    associate = "associate"
    middle = "middle"
    senior = "senior"
    manager = "manager"
    director = "director"
    executive = "executive"


class JobType(str, Enum):
    fulltime = "full-time"
    parttime = "part-time"
    contract = "contract"
    temporary = "temporary"
    volunteer = "volunteer"
    internship = "internship"


class WorkingMode(str, Enum):
    onsite = "onsite"
    hybrid = "hybrid"
    remote = "remote"


class JobStatus(str, Enum):
    closed = "closed"
    pending = "pending"
    open = "open"


class UrgencyLevel(str, Enum):
    urgent = "urgent"
    very_urgent = "very_urgent"
    normal_speed = "normal_speed"
    hard_to_fill = "hard_to_fill"
    very_hard_to_fill = "very_hard_to_fill"


class EducationDegree(str, Enum):
    associate = "associate"
    bachelor = "bachelor"
    master = "master"
    doctorate = "doctorate"
    professional = "professional"


class JobFunctionCreate(BaseModel):
    name: str


class SkillCreate(BaseModel):
    name: str


class JobFunction(BaseSchema, JobFunctionCreate):
    pass


class Skill(BaseSchema, SkillCreate):
    pass


class SalaryCreate(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None
    currency: Optional[Currency] = None
    visible: Optional[bool] = None


class Salary(BaseSchema, SalaryCreate):
    pass


class JobCreate(BaseModel):
    title: Optional[str] = None
    posting_status: Optional[PostingStatus] = None
    job_function_id: Optional[UUID] = None
    job_type: Optional[JobType] = None
    seniority_level: Optional[SeniorityLevel] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    aboutus: Optional[str] = None
    benefits: Optional[str] = None
    salary: Optional[SalaryCreate] = None
    working_mode: Optional[WorkingMode] = None
    skills: Optional[list[str]] = None
    educational_degree: Optional[EducationDegree] = None
    location: Optional[str] = None
    tags: Optional[list[str]] = None
    expiration_date: Optional[datetime] = None
    vacancies: Optional[int] = None
    is_priority: Optional[bool] = None
    received_email: Optional[EmailStr] = None
    received_email_2: Optional[EmailStr] = None
    job_status: Optional[JobStatus] = None
    open_for_headhunt: Optional[bool] = None
    maximum_fee_accepted: Optional[int] = None
    urgency_level: Optional[UrgencyLevel] = None


class JobUpdate(JobCreate):
    pass


class Job(BaseSchema, JobCreate):
    skills: Optional[list[Skill]] = None
    salary: Optional[Salary] = None
    created_by_id: Optional[UUID] = None
