# ----------------------------------------------------------------------------------------------
# ECR
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "this" {
  name                 = var.repo_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# ECR Lifecycle Policy
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name

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

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "this" {
  depends_on = [aws_ecr_repository.this]

  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      AWS_REGION     = var.region
      AWS_ACCOUNT_ID = var.account_id
      REPO_URL       = aws_ecr_repository.this.repository_url
    }
  }
}
