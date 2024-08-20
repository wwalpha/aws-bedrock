output "cognito_identity_pool_id" {
  value = aws_cognito_identity_pool.this.id
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.this.id
}
