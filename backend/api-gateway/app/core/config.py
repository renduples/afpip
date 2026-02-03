from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AFPI API Gateway"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    ENVIRONMENT: str = "development"
    
    # CORS - Allow production frontends
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:8000",
        "https://afpip.com",
        "https://www.afpip.com",
        "https://afpi-frontend-43847292060.us-central1.run.app"
    ]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*.yourdomain.com"]
    
    # Database
    DATABASE_URL: str = "mysql+pymysql://root:toor@localhost:3306/afpi"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_RECYCLE: int = 3600
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_MAX_CONNECTIONS: int = 50
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 100
    
    # Monitoring
    SENTRY_DSN: str = ""
    LOG_LEVEL: str = "INFO"
    
    # GCP
    GCP_PROJECT_ID: str = ""
    GCP_REGION: str = "us-central1"
    
    # Vertex AI
    VERTEX_AI_PROJECT: str = ""
    VERTEX_AI_LOCATION: str = "us-central1"
    VERTEX_AI_MODEL: str = "gemini-pro"
    
    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 100
    ALLOWED_FILE_TYPES: List[str] = ["csv", "xlsx", "pdf", "json"]
    
    # Data Processing
    MAX_CONCURRENT_SCRAPES: int = 5
    SCRAPE_TIMEOUT_SECONDS: int = 300
    API_REQUEST_TIMEOUT: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
