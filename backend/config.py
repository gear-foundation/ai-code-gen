import os
from dotenv import load_dotenv

load_dotenv()


def get_openai_api_key() -> str:
    """
    Get the OpenAI API key from environment variables.
    """
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise ValueError("Missing OPENAI_API_KEY in environment.")
    return key


class Config:
    """Base configuration."""
    DEBUG = False
    TESTING = False

    API_KEY = os.getenv("API_KEY", "default-token")

    RATELIMIT_DEFAULT = "100/hour"
    RATELIMIT_STORAGE_URI = "memory://"

    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "https://vara-code-gen-ai.vercel.app/"
    ]

   
class DevelopmentConfig(Config):
    DEBUG = True
    ALLOWED_ORIGINS = ["https://vara-code-gen-ai.vercel.app/"]


class ProductionConfig(Config):
    ALLOWED_ORIGINS = ["https://vara-code-gen-ai.vercel.app/"]
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    DEBUG = True


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
