from typing import List, TypeVar, Generic, Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from enum import Enum

T = TypeVar("T")


class BaseSchema(BaseModel):
    id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaginationData(BaseModel, Generic[T]):
    items: List[T]
    total: int


class Status(str, Enum):
    pending = "pending"
    waiting = "waiting"
    approved = "approved"
    rejected = "rejected"


class Url(BaseModel):
    url: str


class Message(BaseModel):
    message: str


class Currency(str, Enum):
    USD = "USD"
    VND = "VND"
    EUR = "EUR"
    JPY = "JPY"
    GBP = "GBP"
    CNY = "CNY"
