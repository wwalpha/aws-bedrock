# ----------------------------------------------------------------------------------------------
# Service Discovery Private DNS Namespace
# ----------------------------------------------------------------------------------------------
resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = "${var.prefix}.local"
  description = "${var.prefix}.local"
  vpc         = module.vpc.vpc_id
}
