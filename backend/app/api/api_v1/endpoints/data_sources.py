from typing import List, Optional
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.data_source import DataSource, DataSourceCreate, DataSourceUpdate
from app.crud import data_source as crud

router = APIRouter()


def convert_tags_from_json(data_source):
    """Convert tags JSON string back to list"""
    if data_source.tags:
        try:
            data_source.tags = json.loads(data_source.tags)
        except (json.JSONDecodeError, TypeError):
            data_source.tags = []
    else:
        data_source.tags = []
    return data_source


@router.get("/", response_model=List[DataSource])
def read_data_sources(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all data sources"""
    data_sources = crud.get_data_sources(db, skip=skip, limit=limit)
    return [convert_tags_from_json(ds) for ds in data_sources]


@router.get("/search", response_model=List[DataSource])
def search_data_sources(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Search data sources by query and optional category"""
    data_sources = crud.search_data_sources(
        db, query=q, category=category, skip=skip, limit=limit
    )
    return [convert_tags_from_json(ds) for ds in data_sources]


@router.get("/{data_source_id}", response_model=DataSource)
def read_data_source(data_source_id: int, db: Session = Depends(get_db)):
    """Get a specific data source by ID"""
    db_data_source = crud.get_data_source(db, data_source_id=data_source_id)
    if db_data_source is None:
        raise HTTPException(status_code=404, detail="Data source not found")
    return convert_tags_from_json(db_data_source)


@router.post("/", response_model=DataSource)
def create_data_source(
    data_source: DataSourceCreate,
    db: Session = Depends(get_db)
):
    """Create a new data source"""
    db_data_source = crud.create_data_source(db=db, data_source=data_source)
    return convert_tags_from_json(db_data_source)


@router.put("/{data_source_id}", response_model=DataSource)
def update_data_source(
    data_source_id: int,
    data_source_update: DataSourceUpdate,
    db: Session = Depends(get_db)
):
    """Update a data source"""
    db_data_source = crud.update_data_source(
        db=db, data_source_id=data_source_id, data_source_update=data_source_update
    )
    if db_data_source is None:
        raise HTTPException(status_code=404, detail="Data source not found")
    return convert_tags_from_json(db_data_source)


@router.delete("/{data_source_id}")
def delete_data_source(data_source_id: int, db: Session = Depends(get_db)):
    """Delete a data source"""
    success = crud.delete_data_source(db=db, data_source_id=data_source_id)
    if not success:
        raise HTTPException(status_code=404, detail="Data source not found")
    return {"message": "Data source deleted successfully"}