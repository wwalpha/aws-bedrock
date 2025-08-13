# Terraform コード規約 / 運用ガイド

本プロジェクト (`terraform/` ディレクトリ) における Terraform の記述・運用ルールを定義します。新規リソース追加や改善時は必ず本ガイドに沿ってください。必要な追加事項があれば同 PR 内でこのファイルを更新します。

## 1. ディレクトリ & ファイル構成

- 既存: 目的別にファイル分割 (`apigw.tf`, `cognito.tf`, `dynamodb.tf`, `ecs.tf`, など)。同カテゴリに複数リソースが増えて 300 行超える/責務が混在する場合はサブファイルへ分割 (例: `ecs_cluster.tf`, `ecs_services.tf`).
- `variables.tf` は環境共通の入力値のみ。環境差異を `.tfvars` 側で管理 (`dev.tfvars`, `prod.tfvars` など)。
- `locals.tf` で命名規則やタグ共通値を集中 (例: `local.name_prefix`, `local.common_tags`)。
- `outputs.tf` は外部 (他スタック・CI) が参照する最小限のみ。秘匿値は output しない。
- 将来的に modules 化する場合は `terraform/modules/<module_name>` 配下に配置し、ルートは組み立てのみ行う。

## 2. バージョン & プロバイダ管理

- `terraform.required_version` は最小許容 (`>= 1.8.0, < 2.0.0` のように) を指定し、CI で固定バージョン実行。
- プロバイダは `required_providers` でバージョンをピン or 上限指定 (`~> 5.50` 形式)。
- `provider "aws" { region = var.region }` 以外の動的設定は極力避ける。複数リージョンが必要なら別スタック / 別 working directory を検討。

## 3. 命名規則 (AWS リソース)

- 文字種: 英小文字 + 数字 + ハイフン。スネークケースは使用しない (AWS コンソール整合性)。
- 重複/長大化回避: 既存 prefix が重複する場合 `cmp` など短縮 (例: `bedrock-dev-cmp-task`)
- S3 バケット: グローバル一意性確保のため `bedrock-<env>-<purpose>-<account_id>` を推奨 (account id は locals 側で動的挿入可)。
- DynamoDB テーブル, SQS, SNS Topic: 省略不可な語尾を付与 (`-table`, `-queue`, `-topic` は不要 / 冗長な場合は省略・既存形式に合わせる)。

## 4. 変数 / locals / 出力

- 変数命名: 小文字 + アンダースコア。例: `project_name`, `default_tags`。
- 可能な限り型指定 (`type = object({ ... })`, `type = map(string)` 等)。
- `validation` ブロックで重要制約を明示 (例: 長さ/文字制限)。
- `locals` にドメイン知識 (命名プレフィックス組立, タグ標準, 共通ポリシー JSON) を閉じ込めコード重複削減。
- Output は**最小**。秘匿値 (シークレット, パスワード, トークン) は出力しない。

## 5. タグ付与ポリシー

- すべてのサポートリソースに共通タグ: `Name`, `Environment`, `Project`, `Owner`, `CostCenter` (必要に応じ)。
- `locals.common_tags` を定義し、各リソースに `tags = merge(local.common_tags, { Name = local.xyz_name })` の形で適用。

## 6. セキュリティ & IAM

- IAM Policy は最小権限。`*` (Action/Resource) の使用は最後の手段。例外時はコメントで理由を明記。
- インライン JSON は可読性低下を招くため `jsonencode({ ... })` を使用しインデント管理。
- 認証情報/シークレットは **Terraform state に直接書かない**。SSM Parameter Store (SecureString) か Secrets Manager 経由で参照。
- KMS カスタムキーが必要な場合はキーのポリシーを最小化し CloudTrail ログ有効化。

## 7. ネットワーク

- セキュリティグループ: 1 リソース 1 SG 原則 (用途別)。共用するならコメントで理由。
- Ingress/Egress で 0.0.0.0/0 を許可する場合は明示コメントと TODO (制限方針) を併記。
- VPC/Subnet 構成を変更する場合は破壊的差分 (force replacement) を事前に `terraform plan` で確認し PR に貼る。

## 8. ECS / Lambda / API Gateway

- ECS TaskDefinition はイミュータブル。環境変数の差分反映は新 revision 生成。
- Lambda: バージョニング + エイリアス利用 (本番切替に段階的リリースが必要な場合)。
- API Gateway: ステージ名は環境 (`dev`, `stg`, `prod`) と一致させる。

## 9. モジュール化指針

- 3 回以上繰り返すパターン (同構造の ECS Service, S3 + CloudFront セットなど) を modules 化候補。
- module 出力は外部が必要とする ID / ARN / Name のみ。内部構造 (一時的なローカルリソース) は出力しない。
- 破壊的変更や大規模 rename を伴う場合は最初に module 化 PR で土台を整備してから機能追加。

## 10. count vs for_each

- 論理的キーで参照する必要がある集合 (命名, ラベル): `for_each`。
- 単純な繰り返し (インデックス不要, 増減滅多発しない): `count`。
- `for_each` には `toset([...])` を用いて意図しない差分を抑制。

## 11. ライフサイクル制御

- `lifecycle { prevent_destroy = true }` は不可逆破壊リスク (本番 DB, S3 など) にのみ。
- 強制再作成が頻発するリソースで差分無視が必要なら `ignore_changes` を最小範囲に限定 (例: `ignore_changes = [task_definition]`)。

## 12. State 管理

- リモート State (S3 + DynamoDB Lock) を利用。Bucket のバージョニング + 暗号化を有効化。
- State 内に残すべきでない一時データ (巨大ファイル出力) は外部 (S3 別 bucket) 保管。
- `state pull` / `state mv` / `state rm` を行う場合は手順ログを PR 説明に添付。

## 13. 環境分離

- 環境ごとに backend key を分離 (例: `key = "envs/dev/terraform.tfstate"`)。
- prod 用の apply は CI/CD 経由 (手動 `terraform apply` は緊急時のみ; 事後に再現 PR)。

## 14. CI / 品質チェック

- 事前に `terraform fmt -check`, `terraform validate` 必須。
- 静的解析: `tflint` (ルール拡張), セキュリティ: `tfsec` or `checkov` を導入し PR で失敗させる。
- 実行例 (ローカル):
  ```bash
  terraform init -upgrade
  terraform fmt -recursive
  terraform validate
  tflint
  tfsec .
  terraform plan -var-file=dev.tfvars
  ```

## 15. Plan / Apply フロー

1. ブランチで変更
2. `terraform plan -var-file=<env>.tfvars -out=plan.out`
3. Plan 出力差分を PR に貼る (破壊リソース数 /追加 /変更 数) をサマリ。
4. レビュー承認後 CI が plan 再実行 → human approval → apply。
5. 失敗時は `terraform state` 操作を避け、原則 root cause 修正で再実行。

## 16. ドリフト検知

- 週次 (CI スケジュール) で `terraform plan` を実行し非ゼロ差分を通知。
- 重要リソース (IAM, Security Group, KMS) のドリフトは別途 CloudTrail / Config Rules でも検知。

## 17. インポート (既存リソース取り込み)

- `terraform import` 前に対象リソース設定を HCL に正確再現。
- インポート直後 `plan` で差分ゼロを確認。差分が残る場合は原因コメントを HCL に残す。

## 18. シークレット / 機密情報

- 直接 HCL に書かない。`var` で渡す場合も `sensitive = true`。State 流出防止にローテーションポリシー検討。
- 参照先: AWS Secrets Manager / SSM Parameter Store (SecureString)。

## 19. ロギング & 監査

- CloudTrail, VPC Flow Logs, CloudWatch Logs は暗号化 & 期限管理設定。
- ログが別アカウント集中集約される場合は cross-account IAM role を定義し最小権限。

## 20. 推奨記述パターン

```hcl
locals {
	name_prefix  = "${var.project_name}-${var.env}"  # bedrock-dev
	common_tags  = {
		Project     = var.project_name
		Environment = var.env
		Owner       = var.owner
	}
}

resource "aws_s3_bucket" "artifact" {
	bucket        = "${local.name_prefix}-artifact"
	force_destroy = false

	tags = merge(local.common_tags, { Name = "${local.name_prefix}-artifact" })
}

resource "aws_iam_policy" "task_exec" {
	name        = "${local.name_prefix}-task-exec"
	description = "ECS task execution minimal policy"
	policy      = jsonencode({
		Version = "2012-10-17"
		Statement = [
			{
				Effect   = "Allow"
				Action   = ["ecr:GetAuthorizationToken"]
				Resource = "*"
			}
		]
	})
}
```

## 21. PR レビュー チェックリスト

- [ ] `terraform fmt` 済み / validate エラーなし
- [ ] Plan 差分を PR に貼付 (追加/変更/削除 リソース数) / 破壊変更に根拠説明
- [ ] ハードコードされたリソース名が命名規約に適合
- [ ] 不要な `*` 権限なし / 最小権限
- [ ] タグが全リソースに付与 (`Name`, `Environment`, `Project` 等)
- [ ] 変更が state の予期しない破壊 (DB, S3) を伴わない
- [ ] シークレット露出なし / output に含まれない
- [ ] `API_ENDPOINTS` 等アプリ参照に必要な値のみ output
- [ ] コメントで特殊対応理由が明確

---

本ガイドに反する要件がある場合は PR 説明に「Why:」セクションを設けて例外理由を明記してください。
