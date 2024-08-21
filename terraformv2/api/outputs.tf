output "api_endpoint" {
  value = aws_apigatewayv2_api.this.api_endpoint
}

output "ecr_repo_name_chat" {
  value = module.ecr_chat.repository_name
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.this.name
}
