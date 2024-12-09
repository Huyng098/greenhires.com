from datetime import datetime, timezone
from src.user.schema import CanvaImageType
from sqlalchemy import Column, Integer, String
from sqlalchemy import DateTime, ForeignKey, UUID
from src.model import Base, to_pg_enum
from src.auth.schema import FeatureType


class Feature(Base):
    type = Column(to_pg_enum(FeatureType), nullable=False, default=FeatureType.FREE)
    account_id = Column(
        UUID, ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    num_of_resumes = Column(Integer, nullable=True, default=2)
    num_of_coverletters = Column(Integer, nullable=True, default=2)
    num_of_PDF_exports = Column(Integer, nullable=True, default=0)
    num_of_DOCX_exports = Column(Integer, nullable=True, default=0)
    valid_until = Column(
        DateTime(timezone=True), nullable=False, default=datetime.now(timezone.utc)
    )


class CanvaImage(Base):
    url = Column(String(1024), nullable=False)
    account_id = Column(
        UUID, ForeignKey("account.id", ondelete="CASCADE"), nullable=False
    )
    type = Column(
        to_pg_enum(CanvaImageType), nullable=False, default=CanvaImageType.image
    )
