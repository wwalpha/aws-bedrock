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
EOT

  lifecycle {
    ignore_changes = [
      content,
    ]
  }
}