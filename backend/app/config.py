from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    backend_env: str = "local"
    backend_port: int = 8000
    cors_origins: str = "http://localhost:5173"
    # Matches production + preview deploys on Vercel for this project.
    cors_origin_regex: str = r"https://job-search-command-center.*\.vercel\.app"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = (
        "postgresql://postgres:postgres@localhost:5432/job_search_command_center_local"
    )


class Settings:
    def __init__(self) -> None:
        self.app = AppSettings()
        self.database = DatabaseSettings()


settings = Settings()
