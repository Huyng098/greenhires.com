from src.model import Base, to_pg_enum
from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import String, Text, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship, Mapped
from sqlalchemy import UUID, ForeignKey
from typing import TYPE_CHECKING, List
from src.sample.schema import SampleType
from src.schema import Status

if TYPE_CHECKING:
    from src.resume.model import Resume


class Font(Base):
    name = Column(String(200), nullable=False)
    fonts = Column(JSONB, nullable=False)


class Frame(Base):
    img = Column(String(1024), nullable=False)
    clipPath = Column(Text, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)


class SampleCategory(Base):
    sample_id = Column(
        UUID(as_uuid=True), ForeignKey("sample.id", ondelete="CASCADE"), nullable=False
    )
    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("category.id", ondelete="CASCADE"),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("sample_id", "category_id", name="unique_sample_category"),
    )


class SampleVariant(Base):
    sample_id = Column(
        UUID(as_uuid=True), ForeignKey("sample.id", ondelete="CASCADE"), nullable=False
    )
    imgs = Column(ARRAY(String(1024)), nullable=True, default=[])
    color = Column(String(200), nullable=True, default=None)
    sample: Mapped["Sample"] = relationship("Sample", back_populates="variants")
    __table_args__ = (
        UniqueConstraint("sample_id", "color", name="unique_sample_color"),
    )


class Sample(Base):
    name = Column(String(200), nullable=False)
    resume_canva = Column(JSONB, nullable=True)
    resume_data = Column(JSONB, nullable=True)
    creator_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    approver_id = Column(
        UUID(as_uuid=True),
        ForeignKey("account.id", ondelete="SET NULL"),
        nullable=True,
        default=None,
    )
    status = Column(to_pg_enum(Status), default=Status.pending, nullable=False)
    type = Column(to_pg_enum(SampleType), nullable=False, default=SampleType.TEMPLATE)
    due_date = Column(DateTime(timezone=True), nullable=True, default=None)
    comments = Column(JSONB, nullable=True, default=[])
    # Define relationships explicitly
    creator = relationship("Account", foreign_keys=[creator_id])
    approver = relationship("Account", foreign_keys=[approver_id])
    categories = relationship(
        "Category",
        secondary=SampleCategory.__table__,
        back_populates="samples",
        lazy="joined",
    )
    variants: Mapped[List["SampleVariant"]] = relationship(
        "SampleVariant", back_populates="sample", lazy="joined"
    )


class TextStyles(Base):
    img = Column(String(1024), nullable=False)
    elements = Column(JSONB, nullable=False)
