from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.api.dependencies.db import get_db_session
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPayload
from app.utils.enums import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
user_repository = UserRepository()


def get_current_user(
    db: Annotated[Session, Depends(get_db_session)],
    token: Annotated[str, Depends(oauth2_scheme)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = TokenPayload.model_validate(decode_access_token(token))
    except Exception as exc:
        raise credentials_exception from exc

    user = user_repository.get_by_id(db, int(payload.sub))
    if user is None:
        raise credentials_exception
    return user


def require_roles(*roles: UserRole):
    def dependency(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        return current_user

    return dependency
