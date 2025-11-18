# Legatora Dashboard API

This small FastAPI service provides backend endpoints to power the dashboard UI (sample data).

Quickstart (Windows PowerShell):

1. Create and activate a virtual environment (optional but recommended):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Run the server:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

3. Open the API docs:

http://127.0.0.1:8000/docs

Files added:
- `app/main.py` — FastAPI app and router registration
- `app/api/dashboard.py` — dashboard endpoints (/dashboard/summary, /dashboard/monthly-activity, /dashboard/quick-actions)
- `app/data.py` — deterministic sample data provider
- `app/schemas.py` — Pydantic response models
- `requirements.txt` — dependencies
- `tests/test_api.py` — basic tests for endpoints
