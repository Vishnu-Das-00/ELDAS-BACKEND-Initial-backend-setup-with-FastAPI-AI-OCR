from fastapi import APIRouter

from app.api.routes import (
    auth,
    classrooms,
    evaluations,
    notifications,
    parent,
    progress,
    submissions,
    teacher,
    tests,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(classrooms.router, prefix="/class", tags=["classroom"])
api_router.include_router(parent.router, prefix="/parent", tags=["parent"])
api_router.include_router(tests.router, prefix="/test", tags=["tests"])
api_router.include_router(submissions.router, prefix="/submission", tags=["submissions"])
api_router.include_router(evaluations.router, prefix="/evaluation", tags=["evaluations"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["teacher"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
