"""widen job_applications source column

Revision ID: a8f3c2d91e04
Revises: 295c1c5ae74f
Create Date: 2026-06-29 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a8f3c2d91e04"
down_revision: Union[str, Sequence[str], None] = "295c1c5ae74f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "job_applications",
        "source",
        existing_type=sa.String(length=100),
        type_=sa.Text(),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "job_applications",
        "source",
        existing_type=sa.Text(),
        type_=sa.String(length=100),
        existing_nullable=False,
    )
