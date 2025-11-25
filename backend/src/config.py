from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Config
    API_VERSION: str = "v1"
    API_TITLE: str = "OPM Solver Pro API"
    API_DESCRIPTION: str = "Professional Linear System Solver API"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://opm-solver-6ls9.vercel.app",
        "https://*.vercel.app",
        "https://vercel.app",
    ]
    
    # Limits
    MAX_REQUESTS_PER_HOUR: int = 100
    MAX_MATRIX_SIZE: int = 5000
    CALCULATION_TIMEOUT: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
