locals {
  prefix     = var.project_name
  account_id = data.aws_caller_identity.this.account_id
  region     = data.aws_region.this.id

  # ----------------------------------------------------------------------------------------------
  # ECS
  # ----------------------------------------------------------------------------------------------
  task_def_family_auth      = "${local.prefix}-taskdef-auth"
  task_def_family_chat      = "${local.prefix}-taskdef-chat"
  ecs_container_name_auth   = "${local.prefix}-auth"
  ecs_container_name_chat   = "${local.prefix}-chat"
  ecs_service_name_auth     = "AuthService"
  ecs_service_name_chat     = "ChatService"
  ecs_service_env_file_auth = "environments/auth.env"
  ecs_service_env_file_chat = "environments/chat.env"

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_stage_name        = "v1"
  api_allow_origins_dev = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]

  # ----------------------------------------------------------------------------------------------
  # Lambda
  # ----------------------------------------------------------------------------------------------
  lambda_default_content = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT

  # ----------------------------------------------------------------------------------------------
  # Bedrock KB Locals
  # ----------------------------------------------------------------------------------------------
  bedrock_kb_name          = "${var.project_name}-kb"
  bedrock_kb_os_collection = "${var.project_name}-kb-collection"
  bedrock_kb_vector_index  = "${var.project_name}-kb-index"
  bedrock_kb_s3_prefix_raw = "raw/"
}

# ----------------------------------------------------------------------------------------------
# AWS Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS Account
# ----------------------------------------------------------------------------------------------
data "aws_caller_identity" "this" {}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - Bedrock KB Assume Role
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "bedrock_kb_trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["bedrock.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Archive file 
# ----------------------------------------------------------------------------------------------
data "archive_file" "default" {
  type        = "zip"
  output_path = "${path.module}/dist/default.zip"

  source {
    content  = local.lambda_default_content
    filename = "index.js"
  }
}
