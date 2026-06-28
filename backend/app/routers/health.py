from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.database import check_db_connection

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/db")
def health_check_db() -> dict[str, str]:
    try:
        check_db_connection()
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=503,
            detail={"database": "error", "message": str(exc)},
        ) from exc

    return {"database": "ok"}
