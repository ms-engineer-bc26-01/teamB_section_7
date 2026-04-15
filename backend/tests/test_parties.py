import pytest


def _register_and_login(client, email, display_name="テストユーザー"):
    """ユーザー登録 → ログイン → トークン返却のヘルパー"""
    client.post("/api/auth/register", json={
        "email": email,
        "password": "pass1234",
        "display_name": display_name,
    })
    res = client.post("/api/auth/login", json={
        "email": email,
        "password": "pass1234",
    })
    return res.json()["access_token"]


def _auth(token):
    return {"Authorization": f"Bearer {token}"}


# ── パーティー作成 ────────────────────────────────────────────

def test_create_party_success(client):
    token = _register_and_login(client, "owner@test.com")
    res = client.post("/api/parties/", json={
        "title": "テストパーティー",
        "date": "2026-05-01",
    }, headers=_auth(token))
    assert res.status_code == 200
    data = res.json()
    assert "id" in data
    assert data["title"] == "テストパーティー"
    assert "invite_token" in data


def test_create_party_unauthorized(client):
    res = client.post("/api/parties/", json={
        "title": "未認証パーティー",
        "date": "2026-05-01",
    })
    assert res.status_code == 401


# ── パーティー一覧 ────────────────────────────────────────────

def test_list_parties(client):
    token = _register_and_login(client, "list@test.com")
    client.post("/api/parties/", json={"title": "パーティーA", "date": "2026-05-01"}, headers=_auth(token))
    client.post("/api/parties/", json={"title": "パーティーB", "date": "2026-05-02"}, headers=_auth(token))
    res = client.get("/api/parties/", headers=_auth(token))
    assert res.status_code == 200
    assert len(res.json()) == 2


# ── パーティー詳細 ────────────────────────────────────────────

def test_get_party_success(client):
    token = _register_and_login(client, "detail@test.com")
    create_res = client.post("/api/parties/", json={"title": "詳細テスト", "date": "2026-05-01"}, headers=_auth(token))
    party_id = create_res.json()["id"]
    res = client.get(f"/api/parties/{party_id}", headers=_auth(token))
    assert res.status_code == 200
    assert res.json()["title"] == "詳細テスト"


def test_get_party_not_member(client):
    owner_token = _register_and_login(client, "owner2@test.com")
    other_token = _register_and_login(client, "other@test.com")
    create_res = client.post("/api/parties/", json={"title": "非公開パーティー", "date": "2026-05-01"}, headers=_auth(owner_token))
    party_id = create_res.json()["id"]
    res = client.get(f"/api/parties/{party_id}", headers=_auth(other_token))
    assert res.status_code == 403


# ── パーティー更新 ────────────────────────────────────────────

def test_update_party_by_owner(client):
    token = _register_and_login(client, "update@test.com")
    create_res = client.post("/api/parties/", json={"title": "旧タイトル", "date": "2026-05-01"}, headers=_auth(token))
    party_id = create_res.json()["id"]
    res = client.patch(f"/api/parties/{party_id}", json={"title": "新タイトル"}, headers=_auth(token))
    assert res.status_code == 200


def test_update_party_by_non_owner(client):
    owner_token = _register_and_login(client, "owner3@test.com")
    other_token = _register_and_login(client, "other2@test.com")
    create_res = client.post("/api/parties/", json={"title": "オーナー専用", "date": "2026-05-01"}, headers=_auth(owner_token))
    party_id = create_res.json()["id"]
    # other は参加していないので403
    res = client.patch(f"/api/parties/{party_id}", json={"title": "不正更新"}, headers=_auth(other_token))
    assert res.status_code == 403


# ── パーティー削除 ────────────────────────────────────────────

def test_delete_party_by_owner(client):
    token = _register_and_login(client, "delete@test.com")
    create_res = client.post("/api/parties/", json={"title": "削除対象", "date": "2026-05-01"}, headers=_auth(token))
    party_id = create_res.json()["id"]
    res = client.delete(f"/api/parties/{party_id}", headers=_auth(token))
    assert res.status_code == 200


# ── 招待参加 ──────────────────────────────────────────────────

def test_join_party_with_token(client):
    owner_token = _register_and_login(client, "host@test.com")
    guest_token = _register_and_login(client, "guest@test.com")
    create_res = client.post("/api/parties/", json={"title": "招待パーティー", "date": "2026-05-01"}, headers=_auth(owner_token))
    party = create_res.json()
    party_id = party["id"]
    invite_token = party["invite_token"]
    res = client.post(f"/api/parties/{party_id}/join", json={"invite_token": invite_token}, headers=_auth(guest_token))
    assert res.status_code == 200


def test_join_party_wrong_token(client):
    owner_token = _register_and_login(client, "host2@test.com")
    guest_token = _register_and_login(client, "guest2@test.com")
    create_res = client.post("/api/parties/", json={"title": "招待パーティー2", "date": "2026-05-01"}, headers=_auth(owner_token))
    party_id = create_res.json()["id"]
    res = client.post(f"/api/parties/{party_id}/join", json={"invite_token": "wrong-token"}, headers=_auth(guest_token))
    assert res.status_code == 404
