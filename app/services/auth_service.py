from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse
from app.schemas.user import UserResponse


class AuthService:
    def __init__(self) -> None:
        self.user_repository = UserRepository()

    def signup(self, session: Session, payload: SignupRequest) -> TokenResponse:
        existing_user = self.user_repository.get_by_email(session, payload.email)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered.")

        user = self.user_repository.create(
            session,
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=payload.role,
        )
        session.commit()
        session.refresh(user)
        return self._build_token_response(user)

    def login(self, session: Session, payload: LoginRequest) -> TokenResponse:
        user = self.user_repository.get_by_email(session, payload.email)
        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
        return self._build_token_response(user)

    def _build_token_response(self, user) -> TokenResponse:
        access_token = create_access_token(subject=str(user.id), role=user.role)
        return TokenResponse(
            access_token=access_token,
            role=user.role,
            user=UserResponse.model_validate(user),
        )
