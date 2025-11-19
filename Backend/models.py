from pydantic import BaseModel
from typing import List, Optional
import datetime

# --- 1. Dashboard Models ---
class DashboardMetric(BaseModel):
    """Model for monthly summary metrics (e.g., Total POA Requests)."""
    current_month: int
    comparison_percent: str # e.g., '+5.2% vs last month'

class MonthlyActivityData(BaseModel):
    """Model for monthly request data used for plotting."""
    month: str
    count: int

class DashboardData(BaseModel):
    """Main model for the Dashboard endpoint response."""
    total_poa_requests: DashboardMetric
    pending_approvals: DashboardMetric
    verified_agents: DashboardMetric
    rejected_kyc_issues: DashboardMetric
    monthly_activity: List[MonthlyActivityData]
    annual_total: int
    last_6_month_increase: str # e.g., '+15.8% Last 6 Months'

# --- 2. POA Request Models ---
class POAFile(BaseModel):
    """Model for a single document file attached to a POA Request."""
    file_id: int
    document_type: str
    file_link: str
    submitted_date: str 

class POARequestBase(BaseModel):
    """Base model for POA requests."""
    request_id: str
    principal: str
    category: str
    submitted_date: str
    assigned_agent: str
    status: str
    contact_info: str
    address: str

class POARequest(POARequestBase):
    """Full model for a POA Request, including files."""
    files: List[POAFile]

class NewPOARequest(BaseModel):
    """Model for creating/updating a new POA request."""
    full_name: str
    contact_info: str
    address: str
    category: str
    expiration_date: Optional[str] = None
    description_of_power: str
    checklist_items: List[str]

# --- 3. External Document Verification Models ---
class ExternalDocVerification(BaseModel):
    """Model for an External Document Verification request (used for list and update)."""
    request_id: str
    applicant: str
    category: str
    submitted_date: str
    status: str
    contact_info: str
    address: str

class ExternalDocFile(POAFile):
    """Model for a file in an External Document Verification."""
    rejection_reason: Optional[str] = None
    comment: Optional[str] = None

class ExternalDocVerificationDetails(ExternalDocVerification):
    """Details view for an External Document Verification."""
    files: List[ExternalDocFile]