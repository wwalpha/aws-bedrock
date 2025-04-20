# ----------------------------------------------------------------------------------------------
# AWS WAFv2 IP Set - CloudFront
# ----------------------------------------------------------------------------------------------
resource "aws_wafv2_ip_set" "this" {
  name               = "${var.prefix}-ip-sets"
  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"
  addresses          = var.allow_ip_addresses
}

# ----------------------------------------------------------------------------------------------
# AWS WAFv2 Web ACL - CloudFront
# ----------------------------------------------------------------------------------------------
resource "aws_wafv2_web_acl" "this" {
  name  = "${var.prefix}_WafAcl_CloudFront"
  scope = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "ipsetRule"
    priority = 1

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.this.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "waf-ipset"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "waf-ipset"
    sampled_requests_enabled   = false
  }
}
