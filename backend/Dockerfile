FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
# backend/ 配下を /app/ にコピーするため、
# アプリコードは /app/app/main.py に配置される。
# モジュール指定は app.main:app（/app を起点に app/main.py の app オブジェクト）
