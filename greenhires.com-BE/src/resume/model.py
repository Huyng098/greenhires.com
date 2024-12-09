from sqlalchemy import Column, String, Boolean
from sqlalchemy import UUID, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from src.model import Base, to_pg_enum
from src.resume.schema import BuilderType, ResumeVisibilityEnum, ResumeType


class Resume(Base):
    title = Column(String(100), nullable=False)
    slug = Column(String(100), nullable=False)
    locked = Column(Boolean, default=False)
    visibility = Column(
        to_pg_enum(ResumeVisibilityEnum), default=ResumeVisibilityEnum.private
    )
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    type = Column(to_pg_enum(ResumeType), nullable=False, default=ResumeType.resume)
    resume_data = Column(JSONB, nullable=True)
    resume_canva = Column(JSONB, nullable=True)
    builder_type = Column(to_pg_enum(BuilderType), default=BuilderType.resumeio)
    language = Column(String(10), nullable=False, default="en")
