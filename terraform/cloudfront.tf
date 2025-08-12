# ----------------------------------------------------------------------------------------------
# CloudFront Distribution for Frontend SPA with OAC
# ----------------------------------------------------------------------------------------------
# ----------------------------------------------------------------------------------------------
# CloudFront Origin Access Control - Frontend
# ----------------------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${local.prefix}-frontend-oac"
  description                       = "OAC for ${local.prefix} frontend bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ----------------------------------------------------------------------------------------------
# Data Source - S3 Bucket (Frontend)
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "frontend" {
  bucket = aws_s3_bucket.frontend.bucket
}

# ----------------------------------------------------------------------------------------------
# CloudFront Distribution - Frontend SPA
# ----------------------------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  comment             = "${local.prefix} frontend distribution"
  default_root_object = "index.html"

  origin {
    domain_name              = data.aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "frontend-s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "frontend-s3-origin"

    forwarded_values {
      query_string = true
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - Frontend Bucket Access for CloudFront
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "frontend_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]

    resources = [
      "${aws_s3_bucket.frontend.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.frontend.arn]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Bucket Policy - Frontend OAC
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "frontend_oac" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_bucket_policy.json
}
