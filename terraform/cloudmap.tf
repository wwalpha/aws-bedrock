# ----------------------------------------------------------------------------------------------
# AWS Service Discovery Http Namespace - Auth
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_http_namespace" "auth" {
  name        = "${local.prefix}.auth.local"
  description = "bedrock"
}

# ----------------------------------------------------------------------------------------------
# AWS Service Discovery Http Namespace - Chat
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_http_namespace" "chat" {
  name        = "${local.prefix}.chat.local"
  description = "bedrock"
}
