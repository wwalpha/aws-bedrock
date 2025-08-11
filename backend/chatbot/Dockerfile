# ベースイメージとして Python 3.10 を使用
FROM python:3.12-slim-bookworm

# 作業ディレクトリを設定
WORKDIR /app

# 必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Pythonの依存関係をインストール
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
  pip install --no-cache-dir -r /app/requirements.txt

# アプリケーションコードをコピー
COPY app /app/app

# ポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]