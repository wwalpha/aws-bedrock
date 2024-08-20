# ----------------------------------------------------------------------------------------------
# Service Discovery Private DNS Namespace
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = "${var.prefix}.local"
  description = "${var.prefix}.local"
  vpc         = module.vpc.vpc_id
}

# ----------------------------------------------------------------------------------------------
# Service Discovery Service - Chat
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_service" "chat" {
  name = "chat"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}
