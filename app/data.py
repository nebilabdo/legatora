from datetime import datetime
from typing import List
from .schemas import KPI, MonthlyPoint, SummaryResponse, MonthlyActivityResponse, QuickAction, QuickActionsResponse


def get_summary() -> SummaryResponse:
    # Deterministic sample values mirroring the attachment
    return SummaryResponse(
        total_poa_requests=KPI(label="Total POA Requests", value=240, change_percent=5.2),
        pending_approvals=KPI(label="Pending Approvals", value=12, change_percent=12.0),
        verified_agents=KPI(label="Verified Agents", value=12, change_percent=1.5),
        rejected_kyc_issues=KPI(label="Rejected / KYC Issues", value=5, change_percent=-3.1),
    )


def get_monthly_activity(months: int = 12) -> MonthlyActivityResponse:
    # Simple deterministic series with some peaks to resemble the sample image
    base = [20, 40, 110, 60, 180, 250, 200, 150, 90, 60, 70, 120]
    points: List[MonthlyPoint] = []
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for i in range(min(months, 12)):
        points.append(MonthlyPoint(month=labels[i], value=base[i]))

    return MonthlyActivityResponse(total=sum(p.value for p in points), points=points)


def get_quick_actions() -> QuickActionsResponse:
    actions = [
        QuickAction(id="review_urgent", label="Review Urgent Approvals", description="Review items flagged as urgent"),
        QuickAction(id="assign_flagged", label="Assign Flagged Requests", description="Assign requests that need manual review"),
        QuickAction(id="view_suspicious", label="View Suspicious Accounts", description="Open the suspicious accounts queue"),
    ]
    return QuickActionsResponse(actions=actions)
