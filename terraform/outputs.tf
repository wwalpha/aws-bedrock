# ----------------------------------------------------------------------------------------------
# Output - Cognito User Pool Client ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_client_id" {
  value       = aws_cognito_user_pool_client.this.id
  description = "Cognito User Pool Client ID"
}

# ----------------------------------------------------------------------------------------------
# Output - Cognito User Pool ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.this.id
  description = "Cognito User Pool ID"
}

# ----------------------------------------------------------------------------------------------
# Output - Cognito User Pool Domain
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_domain" {
  value = "https://${local.prefix}${aws_cognito_user_pool_domain.this.domain}.auth.${local.region}.amazoncognito.com"
}

# ----------------------------------------------------------------------------------------------
# Output - API Gateway URL
# ----------------------------------------------------------------------------------------------
output "api_gateway_url" {
  value = aws_apigatewayv2_stage.this.invoke_url
}

# ----------------------------------------------------------------------------------------------
# Output - DynamoDB Chat History Table Name
# ----------------------------------------------------------------------------------------------
output "table_name_chat_history" {
  value = aws_dynamodb_table.chat_history.name
}

# ----------------------------------------------------------------------------------------------
# Output - ECR Auth Repository URL
# ----------------------------------------------------------------------------------------------
output "ecr_auth_repository_url" {
  value       = module.ecr_repo_auth.repository_url
  description = "ECR repository URL for auth"
}

# ----------------------------------------------------------------------------------------------
# Output - ECR Chat Repository URL
# ----------------------------------------------------------------------------------------------
output "ecr_chat_repository_url" {
  value       = module.ecr_repo_chat.repository_url
  description = "ECR repository URL for chat"
}

# ----------------------------------------------------------------------------------------------
# Output - ECR Auth Repository Name
# ----------------------------------------------------------------------------------------------
output "ecr_auth_repository_name" {
  value       = "${var.project_name}/auth"
  description = "ECR repository name for auth"
}

# ----------------------------------------------------------------------------------------------
# Output - ECR Chat Repository Name
# ----------------------------------------------------------------------------------------------
output "ecr_chat_repository_name" {
  value       = "${var.project_name}/chat"
  description = "ECR repository name for chat"
}

# ----------------------------------------------------------------------------------------------
# Output - Frontend Bucket Name
# ----------------------------------------------------------------------------------------------
output "frontend_bucket_name" {
  description = "Frontend S3 bucket name"
  value       = aws_s3_bucket.frontend.bucket
}

# ----------------------------------------------------------------------------------------------
# Output - Frontend CloudFront Domain
# ----------------------------------------------------------------------------------------------
output "frontend_cloudfront_domain" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

# ----------------------------------------------------------------------------------------------
# Output - Frontend CloudFront Distribution ID
# ----------------------------------------------------------------------------------------------
output "frontend_cloudfront_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

