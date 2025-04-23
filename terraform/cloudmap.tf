# ----------------------------------------------------------------------------------------------
# AWS Service Discovery Http Namespace - Auth
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_http_namespace" "auth" {
  name        = "${local.prefix}.auth.local"
  description = "example"
}
