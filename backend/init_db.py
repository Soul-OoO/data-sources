#!/usr/bin/env python3
"""
Database initialization script
"""
from app.core.database import engine, Base
from app.models.data_source import DataSource


def init_db():
    """Initialize database with tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()