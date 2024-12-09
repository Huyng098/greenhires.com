from sqlalchemy import UUID, Column, ForeignKey, String
from src.general.schema import CategoryType
from src.model import Base, to_pg_enum
from sqlalchemy.orm import relationship
from src.sample.model import SampleCategory
from src.ai.model import BackgroundCategory


class Category(Base):
    name = Column(String, nullable=False, unique=True)
    created_by_id = Column(UUID(as_uuid=True),
                           ForeignKey('account.id',
                                      ondelete="CASCADE"), nullable=False)
    type = Column(to_pg_enum(CategoryType), nullable=False,
                  default=CategoryType.RESUME)
    samples = relationship(
        "Sample", secondary=SampleCategory.__table__,
        back_populates='categories')
    background_images = relationship(
        "BackgroundImage", secondary=BackgroundCategory.__table__,
        back_populates="categories"
    )
