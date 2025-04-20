output "ecr_repo_name_chat" {
  value = module.ecr_chat.repository_name
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "cloudmap_namespace" {
  value = aws_service_discovery_private_dns_namespace.this.name
}

output "service_connect_service_chat_arn" {
  value = data.aws_service_discovery_service.chat.arn
}

output "service_connect_service_functions_arn" {
  value = data.aws_service_discovery_service.functions.arn
}

output "service_connect_service_rag_arn" {
  value = data.aws_service_discovery_service.rag.arn
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_private_subnets" {
  value = module.vpc.private_subnets
}
