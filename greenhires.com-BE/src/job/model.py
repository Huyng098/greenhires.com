from src.job.schema import (
    EducationDegree,
    JobStatus,
    JobType,
    PostingStatus,
    SeniorityLevel,
    UrgencyLevel,
    WorkingMode,
)
from src.model import Base, to_pg_enum
from sqlalchemy import (
    UUID,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from src.schema import Currency
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship


class JobFunction(Base):
    name = Column(String, nullable=False, unique=True)


class Salary(Base):
    min = Column(Integer, nullable=True, default=0)
    max = Column(Integer, nullable=True, default=0)
    currency = Column(to_pg_enum(Currency), nullable=True)
    visible = Column(Boolean, nullable=False, default=True)
    job_id = Column(
        UUID(as_uuid=True),
        ForeignKey("job.id", ondelete="CASCADE"),
        nullable=False,
    )


class JobSkill(Base):
    job_id = Column(
        UUID(as_uuid=True), ForeignKey("job.id", ondelete="CASCADE"), primary_key=True
    )
    skill_id = Column(
        UUID(as_uuid=True), ForeignKey("skill.id", ondelete="CASCADE"), primary_key=True
    )


class Skill(Base):
    name = Column(String, nullable=False, unique=True)
    created_by_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="SET NULL"), nullable=True
    )
    jobs = relationship(
        "Job",
        secondary=JobSkill.__table__,
        back_populates="skills",
    )


class Job(Base):
    title = Column(String, nullable=True)
    posting_status = Column(
        to_pg_enum(PostingStatus), nullable=False, default=PostingStatus.draft
    )
    job_function_id = Column(
        UUID(as_uuid=True),
        ForeignKey("jobfunction.id", ondelete="CASCADE"),
        nullable=True,
    )
    salary = relationship("Salary", backref="job", uselist=False, lazy="joined")
    job_type = Column(to_pg_enum(JobType), nullable=True)
    seniority_level = Column(to_pg_enum(SeniorityLevel), nullable=True)
    responsibilities = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    aboutus = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    working_mode = Column(to_pg_enum(WorkingMode), nullable=True)
    skills = relationship(
        "Skill", secondary=JobSkill.__table__, back_populates="jobs", lazy="joined"
    )
    views = Column(Integer, nullable=False, default=0)
    saves = Column(Integer, nullable=False, default=0)

    educational_degree = Column(to_pg_enum(EducationDegree), nullable=True)
    location = Column(String, nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    is_priority = Column(Boolean, nullable=False, default=False)
    vacancies = Column(Integer, nullable=False, default=1)
    received_email = Column(String, nullable=True)
    received_email_2 = Column(String, nullable=True)
    job_status = Column(to_pg_enum(JobStatus), nullable=False, default=JobStatus.open)
    open_for_headhunt = Column(Boolean, nullable=False, default=False)
    maximum_fee_accepted = Column(Integer, nullable=True)
    urgency_level = Column(
        to_pg_enum(UrgencyLevel), nullable=True, default=UrgencyLevel.normal_speed
    )
    created_by_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )


class CV(Base):
    url = Column(String, nullable=False)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )


class JobApplicant(Base):
    job_id = Column(
        UUID(as_uuid=True), ForeignKey("job.id", ondelete="CASCADE"), nullable=False
    )
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    submitted_date = Column(DateTime, nullable=False)
    cv_id = Column(
        UUID(as_uuid=True), ForeignKey("cv.id", ondelete="SET NULL"), nullable=True
    )
