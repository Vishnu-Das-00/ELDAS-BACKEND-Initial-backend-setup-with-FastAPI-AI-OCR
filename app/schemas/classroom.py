from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserResponse


class ClassroomCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=255)


class ClassroomJoinRequest(BaseModel):
    classroom_id: int | None = None
    join_code: str | None = Field(default=None, max_length=16)


class ParentLinkRequest(BaseModel):
    student_id: int


class ClassroomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    teacher_id: int
    join_code: str


class ClassroomDetailResponse(ClassroomResponse):
    teacher: UserResponse
    student_count: int = 0
