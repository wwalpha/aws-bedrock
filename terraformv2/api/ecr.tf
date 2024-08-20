module "ecr_chat" {
  source     = "./m_ecr"
  region     = local.region
  account_id = local.account_id
  repo_name  = "${var.prefix}-chat"
}

# ----------------------------------------------------------------------------------------------
# ECR Lifecycle Policy - Chat Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_lifecycle_policy" "chat" {
  repository = module.ecr_chat.repository_name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire images count more than 3",
      "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 3
      },
      "action": {
          "type": "expire"
      }
    }
  ]
}
EOF
}
