from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class DataSourceBase(BaseModel):
    name: str
    description: Optional[str] = None
    url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_active: bool = True


class DataSourceCreate(DataSourceBase):
    pass


class DataSourceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None


class DataSourceInDBBase(DataSourceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DataSource(DataSourceInDBBase):
    pass


class DataSourceInDB(DataSourceInDBBase):
    pass