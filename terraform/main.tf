# ----------------------------------------------------------------------------------------------
# Terraform Backend & Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {}

terraform {
  backend "s3" {
    bucket  = "arms-terraform-0606"
    key     = "bedrock/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Secrets Manager - Base secret for model API keys (dummy placeholder)
# ----------------------------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "model_api_keys" {
  name        = "${local.prefix}-model-api-keys"
  description = "Base secret (prefix) for per-user model API keys; actual keys stored as versions or sub-secrets"
}

resource "aws_secretsmanager_secret_version" "model_api_keys_dummy" {
  secret_id     = aws_secretsmanager_secret.model_api_keys.id
  secret_string = jsonencode({ info = "placeholder; real keys set manually" })
}
