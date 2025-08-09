# Terraform stack (aws-bedrock/terraform)

AWS 上に Chat/GenAI 用の最小構成をデプロイする Terraform スタックです。API Gateway、ECS(Fargate)、ECR、Cognito、DynamoDB、S3、CloudWatch Logs、Service Discovery(Cloud Map)、Security Group などを作成します。

## 構成概要

主要リソース（各 \*.tf ファイルに対応）

- apigw.tf: API Gateway v2 (HTTP API) と関連設定（必要に応じて VPC Link）
- bucket.tf: 材料/環境ファイル用の S3 バケット（例: `environments/auth.env`, `environments/chat.env`）
- cloudmap.tf: Cloud Map HTTP Namespace（Service Discovery）
- cloudwatch.tf: CloudWatch Logs（API・ECS ログ）
- cognito.tf: Cognito User Pool / User Pool Client / Domain
- dynamodb.tf: チャット履歴用 DynamoDB テーブル（`bedrock_chat_history`）
- ecr.tf: ECR リポジトリ（例: `bedrock/auth`, `bedrock/chat`）
- ecs.tf: ECS クラスター/サービス/タスク定義（Fargate）。Service Connect/Service Discovery 統合
- iam.tf, iam_policy.tf: ECS タスクロール/実行ロールとポリシー
- sg.tf: セキュリティグループ（VPC Link/Inbound Endpoint 用モジュールを使用）
- subnets.tf: デプロイ対象サブネット（変数から参照）
- locals.tf, main.tf: 共通ローカル値、プロバイダ/タグなどのルート定義
- outputs.tf: 出力値（API URL、Cognito 情報、DynamoDB テーブル名）
- variables.tf: 変数定義（`project_name`, `vpc_id`, `vpc_subnets` など）

補足: `.terraform/` 配下は自動生成（モジュールやロックファイル）。`m_ecr/` は ECR 関連の補助、`taskdefs/` はタスク定義テンプレート、`demo/` はサンプルコード/コンテナ用です。

## 前提条件

- Terraform CLI
- AWS 資格情報（Administrator 相当、少なくとも上記リソース作成権限）
- AWS リージョン設定（例: `AWS_REGION` / `AWS_DEFAULT_REGION` 環境変数、または `main.tf` の provider で指定）
- （任意）ECR へコンテナイメージを push する場合: Docker / AWS CLI

## クイックスタート

プロジェクト直下 `terraform/` で以下を実行します。

```bash
# 1) 計画確認
terraform init
terraform plan

# 2) 反映
terraform apply -auto-approve=true

# 3) 破棄（クリーンアップ）
terraform destroy -auto-approve=true
```

パッケージスクリプトも用意しています。

```bash
# 同等の操作
npm run plan     # terraform init && terraform plan
npm run start    # terraform init && terraform apply -auto-approve=true
npm run destroy  # terraform destroy -auto-approve=true
```

注: `package.json` の `srv` は Cloud Map Namespace を直接削除する AWS CLI 例です。固有の Namespace ID に依存するため、そのままの実行は推奨しません。

## 変数（variables.tf）

- `project_name` (string, default: `bedrock`)
  - リソース名プレフィックス等に使用
- `vpc_id` (string)
  - デプロイ先 VPC ID
- `vpc_subnets` (list(string))
  - デプロイに使用するサブネット ID のリスト

上書き例（`terraform.tfvars` または `-var`）:

```hcl
project_name = "bedrock"
vpc_id       = "vpc-xxxxxxxxxxxxxxxxx"
vpc_subnets  = ["subnet-aaaaaaaaaaaaaaaaa", "subnet-bbbbbbbbbbbbbbbbb"]
```

## 出力（outputs.tf）

- `api_gateway_url`: デプロイされた API Gateway のベース URL
- `cognito_user_pool_id`: Cognito User Pool ID
- `cognito_user_pool_client_id`: Cognito User Pool Client ID
- `cognito_user_pool_domain`: Cognito Hosted UI ドメイン URL
- `table_name_chat_history`: DynamoDB テーブル名

`terraform apply` 後、上記が CLI に表示されます。

## コンテナイメージ（ECR）

- ECR リポジトリ（例: `bedrock/auth`, `bedrock/chat`）が作成されます。
- ECS タスク定義は `:latest` 等のタグを参照する想定です。イメージの build/push を事前に行ってください。

例（概略）:

```bash
aws ecr get-login-password --region <REGION> | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

docker build -t bedrock/auth:latest ./backend/auth
# タグ付けしてプッシュ
docker tag bedrock/auth:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/bedrock/auth:latest
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/bedrock/auth:latest
```

## 環境ファイル（S3）

- S3 バケットに `environments/auth.env` / `environments/chat.env` を配置し、ECS タスクで `environmentFiles` として参照します。
- 例（最小）:
  - `auth.env`:
    ```
    TZ=Asia/Tokyo
    AWS_NODEJS_CONNECTION_REUSE_ENABLED=1
    ```
  - `chat.env`:
    ```
    TZ=Asia/Tokyo
    ```

必要に応じて環境変数を追加してください。

## ディレクトリ構成（抜粋）

```
terraform/
  apigw.tf           # API Gateway v2
  bucket.tf          # S3 バケット（環境ファイル格納）
  cloudmap.tf        # Service Discovery (HTTP Namespace)
  cloudwatch.tf      # CloudWatch Logs
  cognito.tf         # Cognito User Pool / Client / Domain
  dynamodb.tf        # DynamoDB (チャット履歴)
  ecr.tf             # ECR リポジトリ
  ecs.tf             # ECS クラスタ/サービス/タスク定義 (Fargate)
  iam*.tf            # IAM ロール/ポリシー
  sg.tf              # Security Groups（モジュール利用）
  subnets.tf         # サブネット関連
  locals.tf          # locals 定義
  main.tf            # プロバイダ/共通設定
  outputs.tf         # 出力
  variables.tf       # 変数
  package.json       # npm scripts (plan/start/destroy)
  m_ecr/             # ECR 関連補助
  taskdefs/          # タスク定義テンプレート
  demo/              # サンプル
```

## アーキテクチャ

> 図版: 上位のドキュメント配下に設計図がある場合は併せて参照してください（例: `../docs/architecture.svg`）。

### コンポーネント構成

- クライアント/フロントエンド
  - ブラウザから API にアクセス。必要に応じて Cognito Hosted UI で認証。
- API Gateway (HTTP API)
  - 外部公開エンドポイントを一本化。必要に応じて VPC Link 経由で VPC 内リソースへルーティング。
- ECS (Fargate) サービス群（Service Connect / Cloud Map 統合）
  - Auth Service: 認証/ユーザー管理のバックエンド（Cognito と連携）。
  - Chat Service: チャット処理・プロバイダー連携（例: Bedrock/LLM）・履歴保存など。
- DynamoDB
  - チャット履歴などのステート保存。
- S3
  - タスク用環境ファイル（`environments/*.env`）や付随する素材を格納。
- Cognito
  - 認証基盤（User Pool / Client / Domain）。Hosted UI によるログインを提供。
- CloudWatch Logs
  - API Gateway / ECS ログの集約・モニタリング。
- Cloud Map (Service Discovery)
  - ECS サービスの名前解決、Service Connect と連携。
- ECR
  - 各サービスのコンテナイメージを保管。

### リクエスト/データフロー

1. ユーザーはフロントエンドから `api_gateway_url` にアクセス。
2. 認証が必要な場合、Cognito Hosted UI でログイン（`cognito_user_pool_domain`）。
3. API Gateway がリクエストを ECS（Fargate）の各サービスにルーティング。
4. Chat Service は必要に応じて LLM プロバイダー（例: Bedrock 等）へアクセスし応答生成。
5. チャット履歴は DynamoDB（`table_name_chat_history`）に保存。
6. すべてのリクエスト・アプリログは CloudWatch Logs に出力。

### ネットワーク/セキュリティ要点

- ECS タスクは指定サブネット（`vpc_subnets`）にデプロイ。Security Group はモジュールで管理。
- S3 はサーバーサイド暗号化（AES256）を利用。環境ファイルの取り扱いに注意。
- IAM ロール/ポリシーはタスク実行・ログ出力・S3/DynamoDB 等の最小権限を付与。

### 運用/ビルド要点

- コンテナは ECR に push 後、ECS のタスク定義で参照（通常 `:latest`）。
- 変更は `terraform plan/apply` で反映、`terraform destroy` で破棄。

## トラブルシュート

- Cloud Map Namespace が残って `terraform destroy` が完了しない場合は、当該 Namespace ID を確認して個別削除が必要になることがあります（`aws servicediscovery delete-namespace --id <ID>`）。
- アカウント/リージョン/サブネット/VPC は環境に合わせて `variables.tf` や provider 設定を調整してください。
- IAM ポリシーやセキュリティグループは最小権限に調整可能です。運用要件に合わせて見直してください。

---

この README は、ディレクトリ内のファイル名・変数・出力値に基づいて作成しています。詳細は各 \*.tf を参照してください。
