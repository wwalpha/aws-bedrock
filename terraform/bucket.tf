# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Artifact
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "artifact" {
  bucket        = local.bucket_name_artifact
  force_destroy = true
}