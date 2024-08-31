# ----------------------------------------------------------------------------------------------
# ECR - Chat Service
# ----------------------------------------------------------------------------------------------
module "ecr_chat" {
  source     = "./m_ecr"
  region     = local.region
  account_id = local.account_id
  repo_name  = "${var.prefix}-chat"
}

# ----------------------------------------------------------------------------------------------
# ECR Lifecycle Policy - Chat Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_lifecycle_policy" "ecr_chat" {
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

# ----------------------------------------------------------------------------------------------
# ECR - Functions Service
# ----------------------------------------------------------------------------------------------
module "ecr_functions" {
  source     = "./m_ecr"
  region     = local.region
  account_id = local.account_id
  repo_name  = "${var.prefix}-functions"
}

# ----------------------------------------------------------------------------------------------
# ECR Lifecycle Policy - Functions Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_lifecycle_policy" "ecr_functions" {
  repository = module.ecr_functions.repository_name

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
# ECR - Rag Service
# ----------------------------------------------------------------------------------------------
module "ecr_rag" {
  source     = "./m_ecr"
  region     = local.region
  account_id = local.account_id
  repo_name  = "${var.prefix}-rag"
}
# ----------------------------------------------------------------------------------------------
# ECR Lifecycle Policy - Rag Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_lifecycle_policy" "ecr_rag" {
  repository = module.ecr_rag.repository_name

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


# # ----------------------------------------------------------------------------------------------
# # ECR - File Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_file" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-file"
# }

# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - File Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_file" {
#   repository = module.ecr_file.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }

# # ----------------------------------------------------------------------------------------------
# # ECR - Image Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_image" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-image"
# }

# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - Image Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_image" {
#   repository = module.ecr_image.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }


# # ----------------------------------------------------------------------------------------------
# # ECR - Predict Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_predict" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-predict"
# }
# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - Predict Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_predict" {
#   repository = module.ecr_predict.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }


# # ----------------------------------------------------------------------------------------------
# # ECR - Share Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_share" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-share"
# }
# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - Share Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_share" {
#   repository = module.ecr_share.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }

# # ----------------------------------------------------------------------------------------------
# # ECR - SystemContexts Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_systemcontexts" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-systemcontexts"
# }
# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - SystemContexts Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_systemcontexts" {
#   repository = module.ecr_systemcontexts.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }

# # ----------------------------------------------------------------------------------------------
# # ECR - Transcribe Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_transcribe" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-transcribe"
# }
# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - Transcribe Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_transcribe" {
#   repository = module.ecr_transcribe.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }

# # ----------------------------------------------------------------------------------------------
# # ECR - WebText Service
# # ----------------------------------------------------------------------------------------------
# module "ecr_webtext" {
#   source     = "./m_ecr"
#   region     = local.region
#   account_id = local.account_id
#   repo_name  = "${var.prefix}-webtext"
# }
# # ----------------------------------------------------------------------------------------------
# # ECR Lifecycle Policy - WebText Service
# # ----------------------------------------------------------------------------------------------
# resource "aws_ecr_lifecycle_policy" "ecr_webtext" {
#   repository = module.ecr_webtext.repository_name

#   policy = <<EOF
# {
#   "rules": [
#     {
#       "rulePriority": 1,
#       "description": "Expire images count more than 3",
#       "selection": {
#           "tagStatus": "any",
#           "countType": "imageCountMoreThan",
#           "countNumber": 3
#       },
#       "action": {
#           "type": "expire"
#       }
#     }
#   ]
# }
# EOF
# }
