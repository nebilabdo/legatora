from fastapi import APIRouter
from .. import data
from .. import schemas

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=schemas.SummaryResponse)
def summary():
    """Return the main KPI summary for the dashboard."""
    return data.get_summary()


@router.get("/monthly-activity", response_model=schemas.MonthlyActivityResponse)
def monthly_activity():
    """Return monthly activity points and total."""
    return data.get_monthly_activity()


@router.get("/quick-actions", response_model=schemas.QuickActionsResponse)
def quick_actions():
    """Return available quick actions for the dashboard UI."""
    return data.get_quick_actions()
