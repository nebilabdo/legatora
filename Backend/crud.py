from typing import List, Dict, Optional
from db import get_db_connection
from models import (
    DashboardData, DashboardMetric, MonthlyActivityData,
    POARequest, POAFile, POARequestBase,
    ExternalDocVerification, ExternalDocVerificationDetails, ExternalDocFile,
    NewPOARequest
)
import uuid
from datetime import datetime

# --- 1. Dashboard Functions (Mock Data) ---
def get_mock_dashboard_data() -> DashboardData:
    """Returns structured mock data for the dashboard."""
    return DashboardData(
        total_poa_requests=DashboardMetric(current_month=240, comparison_percent='+5.2% vs last month'),
        pending_approvals=DashboardMetric(current_month=12, comparison_percent='+12.0% vs last month'),
        verified_agents=DashboardMetric(current_month=12, comparison_percent='+1.5% vs last month'),
        rejected_kyc_issues=DashboardMetric(current_month=5, comparison_percent='-3.1% vs last month'),
        monthly_activity=[
            MonthlyActivityData(month="Jan", count=25),
            MonthlyActivityData(month="Feb", count=60),
            MonthlyActivityData(month="Mar", count=10),
            MonthlyActivityData(month="Apr", count=150),
            MonthlyActivityData(month="May", count=2000),
            MonthlyActivityData(month="Jun", count=500),
            MonthlyActivityData(month="Jul", count=1800),
            MonthlyActivityData(month="Aug", count=100),
            MonthlyActivityData(month="Sep", count=50),
            MonthlyActivityData(month="Oct", count=150),
            MonthlyActivityData(month="Nov", count=100),
            MonthlyActivityData(month="Dec", count=10),
        ],
        annual_total=1482,
        last_6_month_increase='+15.8% Last 6 Months'
    )

# --- 2. POA Requests Functions (CRUD) ---
def get_poa_requests(category: Optional[str], status: Optional[str], sort_by: Optional[str], search: Optional[str]) -> List[POARequestBase]:
    """Retrieves and filters POA requests from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()

    sql = "SELECT request_id, principal, category, submitted_date, assigned_agent, status, contact_info, address FROM poa_requests WHERE 1=1"
    params = []

    if category and category != 'All':
        sql += " AND category = ?"
        params.append(category)
    
    if status and status != 'All':
        sql += " AND status = ?"
        params.append(status)

    if search:
        # Search by principal name or assigned agent
        sql += " AND (principal LIKE ? OR assigned_agent LIKE ?)"
        search_term = f'%{search}%'
        params.extend([search_term, search_term])
        
    if sort_by == 'newest':
        sql += " ORDER BY submitted_date DESC"
    elif sort_by == 'oldest':
        sql += " ORDER BY submitted_date ASC"
    
    rows = cursor.execute(sql, params).fetchall()
    conn.close()

    return [POARequestBase(**dict(row)) for row in rows]

def get_poa_request_details(request_id: str) -> Optional[POARequest]:
    """Retrieves detailed POA request information including files."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get main request details
    request_row = cursor.execute(
        "SELECT * FROM poa_requests WHERE request_id = ?", 
        (request_id,)
    ).fetchone()
    
    if not request_row:
        conn.close()
        return None

    # Get attached files
    file_rows = cursor.execute(
        "SELECT file_id, document_type, file_link, submitted_date FROM poa_request_files WHERE request_id = ?", 
        (request_id,)
    ).fetchall()

    files = [POAFile(**dict(row)) for row in file_rows]
    
    conn.close()
    
    # Combine and return
    request_data = dict(request_row)
    del request_data['id'] 
    
    return POARequest(**request_data, files=files)

def create_poa_request(new_request: NewPOARequest) -> str:
    """Inserts a new POA request into the database and returns the new request_id."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate a unique request ID
    new_request_id = "POA-" + str(uuid.uuid4())[:8].upper()
    submitted_date = datetime.now().strftime("%Y-%m-%d")
    
    sql = """
        INSERT INTO poa_requests (
            request_id, principal, contact_info, address, category, 
            expiration_date, description_of_power, submitted_date, 
            assigned_agent, status
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    # Using new_request.full_name for the 'principal' field
    params = (
        new_request_id,
        new_request.full_name,
        new_request.contact_info,
        new_request.address,
        new_request.category,
        new_request.expiration_date,
        new_request.description_of_power,
        submitted_date,
        "Unassigned", # Default agent for new requests
        "Pending"    # Default status for new requests
    )
    
    try:
        cursor.execute(sql, params)
        conn.commit()
        return new_request_id
    except Exception as e:
        print(f"Error inserting new POA request: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

def update_poa_request(request_id: str, new_data: NewPOARequest) -> bool:
    """Updates an existing POA request."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Simple update SQL statement
    sql = """
        UPDATE poa_requests
        SET principal = ?, contact_info = ?, address = ?, category = ?, 
            expiration_date = ?, description_of_power = ?
        WHERE request_id = ?
    """
    params = (
        new_data.full_name, new_data.contact_info, new_data.address, 
        new_data.category, new_data.expiration_date, new_data.description_of_power,
        request_id
    )
    
    cursor.execute(sql, params)
    conn.commit()
    rows_affected = cursor.rowcount
    conn.close()
    return rows_affected > 0

def delete_poa_request(request_id: str) -> bool:
    """Deletes a POA request and its associated files."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Delete files first to maintain integrity
        cursor.execute("DELETE FROM poa_request_files WHERE request_id = ?", (request_id,))
        cursor.execute("DELETE FROM poa_requests WHERE request_id = ?", (request_id,))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        conn.rollback()
        print(f"Error deleting POA request: {e}")
        return False
    finally:
        conn.close()


# --- 3. External Document Verification Functions (CRUD) ---
def get_external_doc_verifications(category: Optional[str], status: Optional[str], sort_by: Optional[str]) -> List[ExternalDocVerification]:
    """Retrieves and filters External Document Verification requests."""
    conn = get_db_connection()
    cursor = conn.cursor()

    sql = "SELECT request_id, applicant, category, submitted_date, status, contact_info, address FROM external_doc_verifications WHERE 1=1"
    params = []

    if category and category != 'All':
        sql += " AND category = ?"
        params.append(category)
    
    if status and status != 'All':
        sql += " AND status = ?"
        params.append(status)
        
    if sort_by == 'newest':
        sql += " ORDER BY submitted_date DESC"
    elif sort_by == 'oldest':
        sql += " ORDER BY submitted_date ASC"

    rows = cursor.execute(sql, params).fetchall()
    conn.close()

    return [ExternalDocVerification(**dict(row)) for row in rows]

def get_external_doc_verification_details(request_id: str) -> Optional[ExternalDocVerificationDetails]:
    """Retrieves detailed External Document Verification information including files."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get main request details
    request_row = cursor.execute(
        "SELECT * FROM external_doc_verifications WHERE request_id = ?", 
        (request_id,)
    ).fetchone()
    
    if not request_row:
        conn.close()
        return None

    # Get attached files
    file_rows = cursor.execute(
        "SELECT file_id, document_type, file_link, submitted_date, rejection_reason, comment FROM external_doc_files WHERE request_id = ?", 
        (request_id,)
    ).fetchall()

    files = [ExternalDocFile(**dict(row)) for row in file_rows] 

    conn.close()
    
    request_data = dict(request_row)
    del request_data['id'] 
    
    return ExternalDocVerificationDetails(**request_data, files=files)

def update_external_doc_verification(request_id: str, new_data: ExternalDocVerification) -> bool:
    """Updates an existing External Document Verification request's main info."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Update main verification table fields
    sql = """
        UPDATE external_doc_verifications
        SET status = ?, category = ?, applicant = ?, contact_info = ?, address = ?
        WHERE request_id = ?
    """
    params = (
        new_data.status, new_data.category, new_data.applicant, 
        new_data.contact_info, new_data.address, request_id
    )
    
    cursor.execute(sql, params)
    conn.commit()
    rows_affected = cursor.rowcount
    conn.close()
    return rows_affected > 0

def delete_external_doc_verification(request_id: str) -> bool:
    """Deletes an external doc verification request and its associated files."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Delete files first
        cursor.execute("DELETE FROM external_doc_files WHERE request_id = ?", (request_id,))
        # Delete main request
        cursor.execute("DELETE FROM external_doc_verifications WHERE request_id = ?", (request_id,))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        conn.rollback()
        print(f"Error deleting external doc verification: {e}")
        return False
    finally:
        conn.close()