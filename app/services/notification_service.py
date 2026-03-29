import smtplib
from email.message import EmailMessage

from app.core.config import get_settings
from app.models.notification import Notification
from app.models.submission import Submission
from app.repositories.notification_repository import NotificationRepository
from app.repositories.user_repository import UserRepository
from app.utils.enums import NotificationChannel
from app.utils.score import calculate_overall_score


class NotificationService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.notification_repository = NotificationRepository()
        self.user_repository = UserRepository()

    def notify_after_evaluation(self, session, submission: Submission, evaluation) -> None:
        overall_score = calculate_overall_score(
            evaluation.understanding,
            evaluation.concept,
            evaluation.method,
            evaluation.execution_json,
            evaluation.memory,
        )
        if overall_score >= self.settings.weak_score_threshold:
            return

        teacher_id = submission.test.classroom.teacher_id
        parent_ids = self.user_repository.get_parent_ids_for_student(session, submission.student_id)
        targets = [teacher_id, *parent_ids]

        notifications = []
        for user_id in targets:
            notifications.append(
                Notification(
                    user_id=user_id,
                    channel=NotificationChannel.IN_APP,
                    title="Student needs attention",
                    message=(
                        f"{submission.student.name} is struggling in {submission.test.subject} "
                        f"({submission.test.chapter})."
                    ),
                    payload={
                        "student_id": submission.student_id,
                        "submission_id": submission.id,
                        "score": overall_score,
                    },
                )
            )
        self.notification_repository.create_many(session, notifications)
        self._send_email_notifications(session, notifications)

    def _send_email_notifications(self, session, notifications: list[Notification]) -> None:
        if not all(
            [
                self.settings.smtp_host,
                self.settings.smtp_username,
                self.settings.smtp_password,
                self.settings.smtp_from_email,
            ]
        ):
            return

        for notification in notifications:
            user = self.user_repository.get_by_id(session, notification.user_id)
            if user is None:
                continue
            message = EmailMessage()
            message["From"] = self.settings.smtp_from_email
            message["To"] = user.email
            message["Subject"] = notification.title
            message.set_content(notification.message)
            try:
                with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port) as smtp:
                    if self.settings.smtp_use_tls:
                        smtp.starttls()
                    smtp.login(self.settings.smtp_username, self.settings.smtp_password)
                    smtp.send_message(message)
            except Exception:
                continue
