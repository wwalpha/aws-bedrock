# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket for Materials
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "materials" {
  bucket = "${local.prefix}-materials-${local.account_id}"
}

# ----------------------------------------------------------------------------------------------
# AWS S3 Bucket Versioning - Materials
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_versioning" "materials" {
  bucket = aws_s3_bucket.materials.id

  versioning_configuration {
    status = "Enabled"
  }
}

# ----------------------------------------------------------------------------------------------
# Auth Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "auth" {
  bucket  = aws_s3_bucket.materials.bucket
  key     = local.ecs_service_env_file_auth
  content = <<EOT
TZ=Asia/Tokyo
AWS_NODEJS_CONNECTION_REUSE_ENABLED=1
COGNITO_CLIENT_ID=6hgubko3fjhm1b5b9hrcgq929
KNOWLEDGE_TABLE_NAME=${local.prefix}_knowledge
KNOWLEDGE_BUCKET_NAME=${local.prefix}-knowledge-${local.account_id}
EOT

  lifecycle {
    ignore_changes = [
      content,
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Chat Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "chat" {
  bucket  = aws_s3_bucket.materials.bucket
  key     = local.ecs_service_env_file_chat
  content = <<EOT
TZ=Asia/Tokyo
KNOWLEDGE_TABLE_NAME=${local.prefix}_knowledge
KNOWLEDGE_BUCKET_NAME=${local.prefix}-knowledge-${local.account_id}
EOT

  lifecycle {
    ignore_changes = [
      content,
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Bucket for Knowledge document uploads
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "knowledge" {
  bucket = "${local.prefix}-knowledge-${local.account_id}"
}

resource "aws_s3_bucket_versioning" "knowledge" {
  bucket = aws_s3_bucket.knowledge.id
  versioning_configuration { status = "Enabled" }
}
