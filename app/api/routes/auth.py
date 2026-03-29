from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.db import get_db_session
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()
auth_service = AuthService()


@router.post("/signup", response_model=TokenResponse, status_code=201)
def signup(
    payload: SignupRequest,
    db: Annotated[Session, Depends(get_db_session)],
) -> TokenResponse:
    return auth_service.signup(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Annotated[Session, Depends(get_db_session)],
) -> TokenResponse:
    return auth_service.login(db, payload)
