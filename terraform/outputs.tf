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
# Cognito User Pool ID
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
# API Gateway URL
# ----------------------------------------------------------------------------------------------
output "table_name_chat_history" {
  value = aws_dynamodb_table.chat_history.name
}
# output "test" {
#   value = aws_ecs_service.auth
# }
