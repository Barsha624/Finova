import pytest

from app import app
from database.db import initialize_database


@pytest.fixture
def client():
    """Provide a Flask test client for each test."""
    initialize_database()

    app.config["TESTING"] = True

    with app.test_client() as test_client:
        yield test_client


def test_homepage_loads(client):
    response = client.get("/")

    assert response.status_code == 200
    assert b"Finova" in response.data


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.get_json()

    assert data["status"] == "healthy"
    assert data["application"] == "Finova"


def test_summary_endpoint(client):
    response = client.get("/api/summary")

    assert response.status_code == 200

    data = response.get_json()

    assert "total_income" in data
    assert "total_expenses" in data
    assert "balance" in data
    assert "savings_rate" in data


def test_categories_endpoint(client):
    response = client.get("/api/categories")

    assert response.status_code == 200

    data = response.get_json()

    assert isinstance(data, list)

    if data:
        assert "category" in data[0]
        assert "total" in data[0]


def test_transactions_endpoint(client):
    response = client.get("/api/transactions")

    assert response.status_code == 200

    data = response.get_json()

    assert isinstance(data, list)

    if data:
        assert "description" in data[0]
        assert "amount" in data[0]
        assert "transaction_type" in data[0]