output "ecr_repo_name_chat" {
  value = module.ecr_chat.repository_name
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "cloudmap_namespace" {
  value = aws_service_discovery_private_dns_namespace.this.name
}

output "service_discovery_service_chat_arn" {
  value = aws_service_discovery_service.chat.arn
}

output "service_discovery_service_functions_arn" {
  value = aws_service_discovery_service.functions.arn
}

# output "service_discovery_service_transcribe_arn" {
#   value = aws_service_discovery_service.transcribe.arn
# }

# output "service_discovery_service_systemcontexts_arn" {
#   value = aws_service_discovery_service.systemcontexts.arn
# }

# output "service_discovery_service_share_arn" {
#   value = aws_service_discovery_service.share.arn
# }

output "service_discovery_service_rag_arn" {
  value = aws_service_discovery_service.rag.arn
}

# output "service_discovery_service_predict_arn" {
#   value = aws_service_discovery_service.predict.arn
# }

# output "service_discovery_service_image_arn" {
#   value = aws_service_discovery_service.image.arn
# }

# output "service_discovery_service_file_arn" {
#   value = aws_service_discovery_service.file.arn
# }

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "vpc_private_subnets" {
  value = module.vpc.private_subnets
}
