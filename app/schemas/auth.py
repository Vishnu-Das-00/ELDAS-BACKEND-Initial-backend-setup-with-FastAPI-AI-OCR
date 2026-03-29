from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.user import UserResponse
from app.utils.enums import UserRole


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user: UserResponse


class TokenPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    sub: str
    role: UserRole
