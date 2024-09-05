# ----------------------------------------------------------------------------------------------
# ECR Repository URL
# ----------------------------------------------------------------------------------------------
output "repository_url" {
  value = aws_ecr_repository.this.repository_url
}

# ----------------------------------------------------------------------------------------------
# ECR Repository Name
# ----------------------------------------------------------------------------------------------
output "repository_name" {
  value = aws_ecr_repository.this.name
}