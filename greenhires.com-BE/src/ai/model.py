from src.model import Base, to_pg_enum
from sqlalchemy import UUID, Column, ForeignKey, String, UniqueConstraint
from src.ai.schema import BackgroundType
from sqlalchemy.orm import relationship


class BackgroundCategory(Base):
    background_id = Column(
        UUID(as_uuid=True),
        ForeignKey("backgroundimage.id", ondelete="CASCADE"),
        nullable=False,
    )
    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("category.id", ondelete="CASCADE"),
        nullable=False,
    )


class BackgroundImage(Base):
    name = Column(String(100), nullable=True)
    url = Column(String(1024), nullable=False)
    type = Column(
        to_pg_enum(BackgroundType), default=BackgroundType.default, nullable=False
    )
    categories = relationship(
        "Category",
        secondary=BackgroundCategory.__table__,
        back_populates="background_images",
    )
    creator_id = Column(
        UUID(as_uuid=True),
        ForeignKey("account.id", ondelete="SET NULL"),
        nullable=True,
        default=None,
    )


class TextKeywords(Base):
    name = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    __table_args__ = (UniqueConstraint("name", "topic", name="unique_name_topic"),)
