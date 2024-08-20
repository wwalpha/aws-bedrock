# ------------------------------------------------------------------------------------------------
# AWS CloudFront Distribution
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "this" {
  depends_on          = [aws_acm_certificate_validation.global]
  enabled             = true
  default_root_object = local.default_root_object
  # aliases             = ["www.${local.domain_name}"]

  origin {
    domain_name              = data.aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.frontend.bucket
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  custom_error_response {
    error_caching_min_ttl = 3000
    error_code            = 403
    response_code         = 200
    response_page_path    = "/${local.default_root_object}"
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.frontend.bucket
    compress               = true
    viewer_protocol_policy = local.viewer_protocol_policy
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # acm_certificate_arn            = aws_acm_certificate_validation.global.certificate_arn
    # ssl_support_method             = "sni-only"
    # minimum_protocol_version       = "TLSv1.1_2016"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# ------------------------------------------------------------------------------------------------
# Cloudfront Origin Access Control
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.prefix}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
