from typing import List
from pydantic import BaseModel


class KPI(BaseModel):
    label: str
    value: int
    change_percent: float


class SummaryResponse(BaseModel):
    total_poa_requests: KPI
    pending_approvals: KPI
    verified_agents: KPI
    rejected_kyc_issues: KPI


class MonthlyPoint(BaseModel):
    month: str
    value: int


class MonthlyActivityResponse(BaseModel):
    total: int
    points: List[MonthlyPoint]


class QuickAction(BaseModel):
    id: str
    label: str
    description: str | None = None


class QuickActionsResponse(BaseModel):
    actions: List[QuickAction]
