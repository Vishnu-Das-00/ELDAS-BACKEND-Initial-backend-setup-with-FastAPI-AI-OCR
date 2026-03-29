"""initial schema

Revision ID: 20260329_0001
Revises:
Create Date: 2026-03-29 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260329_0001"
down_revision = None
branch_labels = None
depends_on = None


user_role = sa.Enum("student", "teacher", "parent", name="user_role")
submission_status = sa.Enum("pending", "processing", "completed", "failed", name="submission_status")
notification_channel = sa.Enum("in_app", "email", name="notification_channel")


def upgrade() -> None:
    bind = op.get_bind()
    user_role.create(bind, checkfirst=True)
    submission_status.create(bind, checkfirst=True)
    notification_channel.create(bind, checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=False)
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_role", "users", ["role"], unique=False)

    op.create_table(
        "classrooms",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("teacher_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("join_code", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("join_code"),
    )
    op.create_index("ix_classrooms_id", "classrooms", ["id"], unique=False)
    op.create_index("ix_classrooms_teacher_id", "classrooms", ["teacher_id"], unique=False)

    op.create_table(
        "enrollments",
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("class_id", sa.Integer(), sa.ForeignKey("classrooms.id", ondelete="CASCADE"), primary_key=True),
    )

    op.create_table(
        "parent_links",
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    )

    op.create_table(
        "tests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("class_id", sa.Integer(), sa.ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False),
        sa.Column("subject", sa.String(length=120), nullable=False),
        sa.Column("chapter", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_tests_class_id", "tests", ["class_id"], unique=False)
    op.create_index("ix_tests_id", "tests", ["id"], unique=False)
    op.create_index("ix_tests_subject", "tests", ["subject"], unique=False)

    op.create_table(
        "questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("test_id", sa.Integer(), sa.ForeignKey("tests.id", ondelete="CASCADE"), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("subject", sa.String(length=120), nullable=False),
        sa.Column("chapter", sa.String(length=255), nullable=False),
        sa.Column("concepts", sa.JSON(), nullable=False),
        sa.Column("steps", sa.JSON(), nullable=False),
        sa.Column("calculation_types", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_questions_id", "questions", ["id"], unique=False)
    op.create_index("ix_questions_test_id", "questions", ["test_id"], unique=False)

    op.create_table(
        "submissions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("test_id", sa.Integer(), sa.ForeignKey("tests.id", ondelete="CASCADE"), nullable=False),
        sa.Column("answer_text", sa.Text(), nullable=True),
        sa.Column("extracted_text", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(length=500), nullable=True),
        sa.Column("status", submission_status, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_submissions_id", "submissions", ["id"], unique=False)
    op.create_index("ix_submissions_student_id", "submissions", ["student_id"], unique=False)
    op.create_index("ix_submissions_test_id", "submissions", ["test_id"], unique=False)
    op.create_index("ix_submissions_status", "submissions", ["status"], unique=False)

    op.create_table(
        "evaluations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("submission_id", sa.Integer(), sa.ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("understanding", sa.Boolean(), nullable=False),
        sa.Column("concept", sa.Boolean(), nullable=False),
        sa.Column("method", sa.Boolean(), nullable=False),
        sa.Column("execution_json", sa.JSON(), nullable=False),
        sa.Column("memory", sa.Boolean(), nullable=False),
        sa.Column("error_reason", sa.Text(), nullable=False, server_default=""),
        sa.Column("raw_response", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("submission_id"),
    )
    op.create_index("ix_evaluations_id", "evaluations", ["id"], unique=False)
    op.create_index("ix_evaluations_submission_id", "evaluations", ["submission_id"], unique=False)

    op.create_table(
        "progress",
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("subject", sa.String(length=120), primary_key=True),
        sa.Column("skill_scores", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("channel", notification_channel, nullable=False, server_default="in_app"),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_notifications_id", "notifications", ["id"], unique=False)
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_notifications_user_id", table_name="notifications")
    op.drop_index("ix_notifications_id", table_name="notifications")
    op.drop_table("notifications")
    op.drop_table("progress")
    op.drop_index("ix_evaluations_submission_id", table_name="evaluations")
    op.drop_index("ix_evaluations_id", table_name="evaluations")
    op.drop_table("evaluations")
    op.drop_index("ix_submissions_status", table_name="submissions")
    op.drop_index("ix_submissions_test_id", table_name="submissions")
    op.drop_index("ix_submissions_student_id", table_name="submissions")
    op.drop_index("ix_submissions_id", table_name="submissions")
    op.drop_table("submissions")
    op.drop_index("ix_questions_test_id", table_name="questions")
    op.drop_index("ix_questions_id", table_name="questions")
    op.drop_table("questions")
    op.drop_index("ix_tests_subject", table_name="tests")
    op.drop_index("ix_tests_id", table_name="tests")
    op.drop_index("ix_tests_class_id", table_name="tests")
    op.drop_table("tests")
    op.drop_table("parent_links")
    op.drop_table("enrollments")
    op.drop_index("ix_classrooms_teacher_id", table_name="classrooms")
    op.drop_index("ix_classrooms_id", table_name="classrooms")
    op.drop_table("classrooms")
    op.drop_index("ix_users_role", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    bind = op.get_bind()
    notification_channel.drop(bind, checkfirst=True)
    submission_status.drop(bind, checkfirst=True)
    user_role.drop(bind, checkfirst=True)
