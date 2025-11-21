from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware  # <-- import CORSMiddleware
from typing import List, Optional
import crud
from models import (
    DashboardData, POARequestBase, POARequest, NewPOARequest, 
    ExternalDocVerification, ExternalDocVerificationDetails
)

app = FastAPI(
    title="LEGATORA Admin API Mock",
    description="Mock API for the LEGATORA Admin Portal using FastAPI and SQLite."
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://legatora.vercel.app/"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)
# ------------------------------------------------

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the LEGATORA Admin Mock API. Check out /docs for endpoints."}


@app.get("/dashboard", response_model=DashboardData, tags=["Dashboard"])
def get_dashboard_summary():
    """Returns key metrics and activity data for the admin dashboard."""
    return crud.get_mock_dashboard_data()


@app.get("/poa-requests", response_model=List[POARequestBase], tags=["POA Requests"])
def list_poa_requests(
    category: Optional[str] = Query(None, description="Filter by POA category (e.g., Property, Medical)"),
    status: Optional[str] = Query(None, description="Filter by status (e.g., Active, Pending, Rejected)"),
    sort_by: Optional[str] = Query("newest", description="Sort by submission date: 'newest' or 'oldest'"),
    search: Optional[str] = Query(None, description="Search by Principal or Assigned Agent name")
):
    """Lists POA requests with filtering, sorting, and search capabilities."""
    return crud.get_poa_requests(category, status, sort_by, search)

@app.get("/poa-requests/{request_id}", response_model=POARequest, tags=["POA Requests"])
def get_poa_request_details(request_id: str):
    """Gets full details for a specific POA request, including attached documents."""
    details = crud.get_poa_request_details(request_id)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="POA Request not found")
    return details

@app.post("/poa-requests", status_code=status.HTTP_201_CREATED, tags=["POA Requests"])
def create_new_poa_request(new_request: NewPOARequest):
    """
    Creates a new POA request and inserts it into the database, returning the new request ID.
    """
    try:
        request_id = crud.create_poa_request(new_request)
        return {
            "message": "POA Request submitted successfully",
            "request_id": request_id,
            "status": "Pending"
        }
    except Exception as e:
        print(f"Failed to create POA request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create POA request in the database."
        )

@app.patch("/poa-requests/{request_id}", tags=["POA Requests"])
def update_poa_request_endpoint(request_id: str, new_data: NewPOARequest):
    """Updates an existing POA request."""
    success = crud.update_poa_request(request_id, new_data)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"POA Request {request_id} not found.")
    return {"message": f"POA Request {request_id} updated successfully."}

@app.delete("/poa-requests/{request_id}", tags=["POA Requests"])
def delete_poa_request_endpoint(request_id: str):
    """Deletes a POA request and all associated files."""
    success = crud.delete_poa_request(request_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"POA Request {request_id} not found.")
    return {"message": f"POA Request {request_id} deleted successfully."}


@app.get("/external-doc-verification", response_model=List[ExternalDocVerification], tags=["External Document Verification"])
def list_external_doc_verifications(
    category: Optional[str] = Query(None, description="Filter by document category"),
    status: Optional[str] = Query(None, description="Filter by verification status (e.g., Verified, Pending, Rejected)"),
    sort_by: Optional[str] = Query("newest", description="Sort by submission date: 'newest' or 'oldest'")
):
    """Lists external document verification requests with filtering and sorting."""
    return crud.get_external_doc_verifications(category, status, sort_by)

@app.get("/external-doc-verification/{request_id}", response_model=ExternalDocVerificationDetails, tags=["External Document Verification"])
def get_external_doc_verification_details(request_id: str):
    """Gets full details for a specific external verification request, including document rejection details."""
    details = crud.get_external_doc_verification_details(request_id)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="External Document Verification Request not found")
    return details

@app.patch("/external-doc-verification/{request_id}", tags=["External Document Verification"])
def update_external_doc_verification_endpoint(request_id: str, new_data: ExternalDocVerification):
    """Updates an existing External Document Verification request's main fields."""
    success = crud.update_external_doc_verification(request_id, new_data)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"External Doc Verification {request_id} not found.")
    return {"message": f"External Doc Verification {request_id} updated successfully."}

@app.delete("/external-doc-verification/{request_id}", tags=["External Document Verification"])
def delete_external_doc_verification_endpoint(request_id: str):
    """Deletes an external doc verification request and all associated files."""
    success = crud.delete_external_doc_verification(request_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"External Doc Verification {request_id} not found.")
    return {"message": f"External Doc Verification {request_id} deleted successfully."}

