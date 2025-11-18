import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health():
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_dashboard_summary():
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/dashboard/summary")
    assert r.status_code == 200
    data = r.json()
    assert "total_poa_requests" in data
    assert data["total_poa_requests"]["value"] == 240


@pytest.mark.asyncio
async def test_monthly_activity():
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/dashboard/monthly-activity")
    assert r.status_code == 200
    data = r.json()
    assert data["total"] == sum(p["value"] for p in data["points"]) 
    assert len(data["points"]) >= 1


@pytest.mark.asyncio
async def test_quick_actions():
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/dashboard/quick-actions")
    assert r.status_code == 200
    data = r.json()
    assert "actions" in data
    assert any(a["id"] == "review_urgent" for a in data["actions"]) 
