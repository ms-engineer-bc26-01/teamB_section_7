import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import db


def pytest_configure(config):
    uri = os.environ.get("MONGO_URI", "")
    assert "test" in uri, (
        "【安全ガード】テスト実行時は MONGO_URI に 'test' を含むDB名を指定してください。\n"
        f"現在の値: {uri}"
    )


@pytest.fixture(scope="function")
def client():
    yield TestClient(app)


@pytest.fixture(autouse=True)
def cleanup():
    yield
    db.users.delete_many({})
    db.parties.delete_many({})
    db.items.delete_many({})
