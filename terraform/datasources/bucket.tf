# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Kendra Data Source
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "datasource" {
  bucket        = local.bucket_name_kendra_datasources
  force_destroy = true
}
