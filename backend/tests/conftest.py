import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import db

@pytest.fixture(scope="function")
def client():
    yield TestClient(app)

@pytest.fixture(autouse=True)
def cleanup():
    yield
    db.users.delete_many({})
    db.parties.delete_many({})
    db.items.delete_many({})
