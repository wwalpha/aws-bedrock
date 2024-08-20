# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Frontend
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket Policy - Frontend
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "frontend" {
  depends_on = [aws_cloudfront_origin_access_identity.this]
  bucket     = aws_s3_bucket.frontend.id
  policy     = data.aws_iam_policy_document.frontend.json
}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - Frontend
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "frontend" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.frontend.bucket}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.this.arn]
    }
  }
}
