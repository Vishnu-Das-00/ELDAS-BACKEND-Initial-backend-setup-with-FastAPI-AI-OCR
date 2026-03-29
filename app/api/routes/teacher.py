from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import require_roles
from app.api.dependencies.db import get_db_session
from app.schemas.teacher import TeacherDashboardResponse
from app.services.dashboard_service import DashboardService
from app.utils.enums import UserRole

router = APIRouter()
dashboard_service = DashboardService()


@router.get("/class/{class_id}", response_model=TeacherDashboardResponse)
def get_teacher_dashboard(
    class_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(require_roles(UserRole.TEACHER)),
) -> TeacherDashboardResponse:
    return dashboard_service.get_teacher_dashboard(db, current_user, class_id)
