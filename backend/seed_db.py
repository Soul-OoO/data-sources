#!/usr/bin/env python3
"""
Seed script to populate database with sample data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.crud.data_source import create_data_source
from app.schemas.data_source import DataSourceCreate


def seed_data():
    """Add sample data to the database"""
    db = SessionLocal()
    
    sample_data_sources = [
        DataSourceCreate(
            name="GitHub API",
            description="GitHub's REST API for accessing repository data, user information, and more",
            url="https://api.github.com",
            category="Development",
            tags=["api", "git", "code", "repository"],
            is_active=True
        ),
        DataSourceCreate(
            name="JSONPlaceholder",
            description="Free fake API for testing and prototyping",
            url="https://jsonplaceholder.typicode.com",
            category="Testing",
            tags=["api", "testing", "fake-data", "prototype"],
            is_active=True
        ),
        DataSourceCreate(
            name="OpenWeatherMap API",
            description="Weather data and forecasts API",
            url="https://openweathermap.org/api",
            category="Weather",
            tags=["weather", "api", "forecast", "climate"],
            is_active=True
        ),
        DataSourceCreate(
            name="REST Countries",
            description="Get information about countries via a RESTful API",
            url="https://restcountries.com",
            category="Geography",
            tags=["countries", "geography", "api", "data"],
            is_active=True
        ),
        DataSourceCreate(
            name="CoinGecko API",
            description="Cryptocurrency data API",
            url="https://api.coingecko.com",
            category="Finance",
            tags=["crypto", "finance", "api", "market-data"],
            is_active=True
        )
    ]
    
    try:
        for data_source in sample_data_sources:
            create_data_source(db=db, data_source=data_source)
        
        print(f"Successfully seeded {len(sample_data_sources)} data sources!")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()