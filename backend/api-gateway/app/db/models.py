"""
Database models for AFPI - Compatible with MariaDB/MySQL
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from datetime import datetime
from app.db.database import Base

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), index=True)
    type = Column(String(50))  # api, scraper, file
    status = Column(String(50))  # active, inactive, error
    config = Column(JSON)
    last_sync = Column(DateTime, default=datetime.utcnow)
    record_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), index=True)
    status = Column(String(50))  # running, paused, stopped, error
    taxonomy = Column(String(100))
    model = Column(String(100))  # gemini-pro, palm2, etc
    config = Column(JSON)
    progress = Column(Integer, default=0)
    records_processed = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Taxonomy(Base):
    __tablename__ = "taxonomies"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(Text)
    hierarchy = Column(JSON)
    category_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    agent_id = Column(String(50))
    taxonomy = Column(String(100))
    results = Column(JSON)
    completed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
