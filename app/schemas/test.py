from pydantic import BaseModel, ConfigDict, Field


class QuestionCreateRequest(BaseModel):
    text: str = Field(min_length=1)
    subject: str = Field(min_length=1, max_length=120)
    chapter: str = Field(min_length=1, max_length=255)
    concepts: list[str] = Field(default_factory=list)
    steps: list[str] = Field(default_factory=list)
    calculation_types: list[str] = Field(default_factory=list)


class QuestionResponse(QuestionCreateRequest):
    model_config = ConfigDict(from_attributes=True)

    id: int
    test_id: int


class TestCreateRequest(BaseModel):
    class_id: int
    subject: str = Field(min_length=1, max_length=120)
    chapter: str = Field(min_length=1, max_length=255)
    questions: list[QuestionCreateRequest] = Field(min_length=1)


class TestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    class_id: int
    subject: str
    chapter: str
    questions: list[QuestionResponse]
