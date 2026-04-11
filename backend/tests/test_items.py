def test_add_item_as_member(client):
    # 1. ユーザー登録
    client.post("/api/auth/register", json={
        "email": "a@test.com",
        "password": "pass1234",
        "display_name": "A"
    })

    # 2. ログインしてトークン取得
    login_res = client.post("/api/auth/login", json={
        "email": "a@test.com",
        "password": "pass1234"
    })
    token = login_res.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # 3. パーティー作成
    party_res = client.post("/api/parties", json={
        "title": "テストパーティー",
        "date": "2026-04-20"
    }, headers=headers)

    party_id = party_res.json()["id"]

    # 4. アイテム追加
    res = client.post(f"/api/parties/{party_id}/items", json={
        "name": "唐揚げ",
        "category": "料理",
        "quantity": "4人前"
    }, headers=headers)

    # 5. 結果確認
    assert res.status_code == 200


def test_add_item_unauthorized(client):
    res = client.post("/api/parties/dummy_id/items", json={
        "name": "ビール",
        "category": "飲み物",
        "quantity": "6本"
    })

    assert res.status_code == 403