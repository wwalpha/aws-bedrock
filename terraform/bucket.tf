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
  bucket       = aws_s3_bucket.materials.bucket
  key          = local.ecs_service_env_file_auth
  content_type = "text/plain; charset=utf-8"
  content      = <<EOT
TZ=Asia/Tokyo
AWS_NODEJS_CONNECTION_REUSE_ENABLED=1
COGNITO_CLIENT_ID=${aws_cognito_user_pool_client.this.id}
KNOWLEDGE_TABLE_NAME=${local.prefix}_knowledge
KNOWLEDGE_BUCKET_NAME=${local.prefix}-knowledge-${local.account_id}
EOT
}

# ----------------------------------------------------------------------------------------------
# S3 Bucket for Frontend SPA hosting (private, accessed via CloudFront OAC)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = "${local.prefix}-frontend-${local.account_id}"
}

resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ----------------------------------------------------------------------------------------------
# Chat Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "chat" {
  bucket       = aws_s3_bucket.materials.bucket
  key          = local.ecs_service_env_file_chat
  content_type = "text/plain; charset=utf-8"
  content      = <<EOT
TZ=Asia/Tokyo
KNOWLEDGE_TABLE_NAME=${local.prefix}_knowledge
KNOWLEDGE_BUCKET_NAME=${local.prefix}-knowledge-${local.account_id}
FRONTEND_CLOUDFRONT_DOMAIN=${try(aws_cloudfront_distribution.frontend.domain_name, "")}
EOT
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
