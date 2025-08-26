from typing import List, Optional
import json
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.data_source import DataSource
from app.schemas.data_source import DataSourceCreate, DataSourceUpdate


def get_data_source(db: Session, data_source_id: int) -> Optional[DataSource]:
    return db.query(DataSource).filter(DataSource.id == data_source_id).first()


def get_data_sources(
    db: Session, skip: int = 0, limit: int = 100
) -> List[DataSource]:
    return db.query(DataSource).offset(skip).limit(limit).all()


def search_data_sources(
    db: Session, query: str, category: Optional[str] = None, skip: int = 0, limit: int = 100
) -> List[DataSource]:
    db_query = db.query(DataSource)
    
    if query:
        db_query = db_query.filter(
            or_(
                DataSource.name.contains(query),
                DataSource.description.contains(query),
                DataSource.tags.contains(query)
            )
        )
    
    if category:
        db_query = db_query.filter(DataSource.category == category)
    
    return db_query.filter(DataSource.is_active == True).offset(skip).limit(limit).all()


def create_data_source(db: Session, data_source: DataSourceCreate) -> DataSource:
    # Convert tags list to JSON string
    tags_json = json.dumps(data_source.tags) if data_source.tags else None
    
    db_data_source = DataSource(
        name=data_source.name,
        description=data_source.description,
        url=data_source.url,
        category=data_source.category,
        tags=tags_json,
        is_active=data_source.is_active
    )
    db.add(db_data_source)
    db.commit()
    db.refresh(db_data_source)
    return db_data_source


def update_data_source(
    db: Session, data_source_id: int, data_source_update: DataSourceUpdate
) -> Optional[DataSource]:
    db_data_source = db.query(DataSource).filter(DataSource.id == data_source_id).first()
    if not db_data_source:
        return None
    
    update_data = data_source_update.dict(exclude_unset=True)
    
    # Convert tags list to JSON string if provided
    if "tags" in update_data:
        update_data["tags"] = json.dumps(update_data["tags"]) if update_data["tags"] else None
    
    for field, value in update_data.items():
        setattr(db_data_source, field, value)
    
    db.commit()
    db.refresh(db_data_source)
    return db_data_source


def delete_data_source(db: Session, data_source_id: int) -> bool:
    db_data_source = db.query(DataSource).filter(DataSource.id == data_source_id).first()
    if not db_data_source:
        return False
    
    db.delete(db_data_source)
    db.commit()
    return True