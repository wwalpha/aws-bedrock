locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  account_id = data.aws_caller_identity.this.account_id
  region     = data.aws_region.this.name

  # ----------------------------------------------------------------------------------------------
  # Lambda
  # ----------------------------------------------------------------------------------------------
  lambda_handler           = "index.handler"
  lambda_runtime_nodejs_20 = "nodejs20.x"

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  apigw_integration_id_backend = "local.remote_services.apigw_integration_id_backend"

  # ----------------------------------------------------------------------------------------------
  # VPC
  # ----------------------------------------------------------------------------------------------
  vpc_cidr_block                 = "10.0.0.0/16"
  vpc_availability_zones         = ["ap-northeast-1a", "ap-northeast-1c"]
  vpc_subnets_cidr_block_public  = ["10.0.0.0/24", "10.0.1.0/24"]
  vpc_subnets_cidr_block_private = ["10.0.2.0/24", "10.0.3.0/24"]
}

# ----------------------------------------------------------------------------------------------
# AWS Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS Account
# ----------------------------------------------------------------------------------------------
data "aws_caller_identity" "this" {}

# ----------------------------------------------------------------------------------------------
# CloudMap Service - Chat
# ----------------------------------------------------------------------------------------------
data "aws_service_discovery_service" "chat" {
  namespace_id = aws_service_discovery_private_dns_namespace.this.id
  name         = aws_ecs_service.chat.service_connect_configuration[0].service[0].port_name
}

# ----------------------------------------------------------------------------------------------
# CloudMap Service - Functions
# ----------------------------------------------------------------------------------------------
data "aws_service_discovery_service" "functions" {
  namespace_id = aws_service_discovery_private_dns_namespace.this.id
  name         = aws_ecs_service.functions.service_connect_configuration[0].service[0].port_name
}

# ----------------------------------------------------------------------------------------------
# CloudMap Service - Rag
# ----------------------------------------------------------------------------------------------
data "aws_service_discovery_service" "rag" {
  namespace_id = aws_service_discovery_private_dns_namespace.this.id
  name         = aws_ecs_service.rag.service_connect_configuration[0].service[0].port_name
}
