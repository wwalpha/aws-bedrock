# ----------------------------------------------------------------------------------------------
# Cognito User Pool Client ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_client_id" {
  value       = aws_cognito_user_pool_client.this.id
  description = "Cognito User Pool Client ID"
}

# ----------------------------------------------------------------------------------------------
# Cognito User Pool ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.this.id
  description = "Cognito User Pool ID"
}

# ----------------------------------------------------------------------------------------------
# Cognito User Pool Domain
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_domain" {
  value = "https://${local.prefix}${aws_cognito_user_pool_domain.this.domain}.auth.${local.region}.amazoncognito.com"
}

# ----------------------------------------------------------------------------------------------
# API Gateway URL
# ----------------------------------------------------------------------------------------------
output "api_gateway_url" {
  value = aws_apigatewayv2_stage.this.invoke_url
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Chat History Table Name
# ----------------------------------------------------------------------------------------------
output "table_name_chat_history" {
  value = aws_dynamodb_table.chat_history.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repositories
# ----------------------------------------------------------------------------------------------
output "ecr_auth_repository_url" {
  value       = module.ecr_repo_auth.repository_url
  description = "ECR repository URL for auth"
}

output "ecr_chat_repository_url" {
  value       = module.ecr_repo_chat.repository_url
  description = "ECR repository URL for chat"
}

output "ecr_auth_repository_name" {
  value       = "${var.project_name}/auth"
  description = "ECR repository name for auth"
}

output "ecr_chat_repository_name" {
  value       = "${var.project_name}/chat"
  description = "ECR repository name for chat"
}
