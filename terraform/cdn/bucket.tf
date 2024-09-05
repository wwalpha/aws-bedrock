# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Frontend
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket        = local.bucket_name_frontend
  force_destroy = true
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket Policy - Frontend
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend.json
}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - Frontend
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "frontend" {
  depends_on = [aws_cloudfront_distribution.this]

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
