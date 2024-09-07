# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Artifact
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "artifact" {
  bucket        = local.bucket_name_artifact
  force_destroy = true
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket Versioning - Artifact
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_versioning" "artifact" {
  bucket = aws_s3_bucket.artifact.id
  versioning_configuration {
    status = "Enabled"
  }
}
