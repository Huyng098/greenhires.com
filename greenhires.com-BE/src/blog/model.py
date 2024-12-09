from sqlalchemy import UUID, Boolean, Integer, Text, Column, ForeignKey, String
from src.model import Base, to_pg_enum
from sqlalchemy.orm import relationship, Mapped
from typing import TYPE_CHECKING
from sqlalchemy.dialects.postgresql import JSONB
from src.schema import Status

if TYPE_CHECKING:
    from src.auth.model import Account


class Blog(Base):
    title = Column(String, nullable=False, unique=True)
    slug = Column(String, nullable=False, unique=True)
    content = Column(Text, nullable=True)
    author_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    author: Mapped["Account"] = relationship("Account", back_populates="blogs")
    status = Column(to_pg_enum(Status), default=Status.pending, nullable=False)
    category_id = Column(
        UUID(as_uuid=True),
        ForeignKey("category.id", ondelete="SET NULL"),
        nullable=True,
        default=None,
    )
    banner = Column(String(1024), nullable=True)
    approver_id = Column(
        UUID(as_uuid=True),
        ForeignKey("account.id", ondelete="SET NULL"),
        nullable=True,
        default=None,
    )
    comments = Column(JSONB, nullable=True, default=[])

    # Define relationships explicitly
    author = relationship("Account", foreign_keys=[author_id])
    approver = relationship("Account", foreign_keys=[approver_id])


class Comment(Base):
    content = Column(Text, nullable=False)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    blog_id = Column(
        UUID(as_uuid=True), ForeignKey("blog.id", ondelete="CASCADE"), nullable=False
    )
    isHidden = Column(Boolean, default=True)


class ParentChildComment(Base):
    parent_comment_id = Column(
        UUID(as_uuid=True), ForeignKey("comment.id", ondelete="CASCADE"), nullable=True
    )
    child_comment_id = Column(
        UUID(as_uuid=True), ForeignKey("comment.id", ondelete="CASCADE"), nullable=False
    )

    # Define relationships explicitly
    parent_comment = relationship("Comment", foreign_keys=[parent_comment_id])
    child_comment = relationship("Comment", foreign_keys=[child_comment_id])
