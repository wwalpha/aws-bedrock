# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "arms-terraform-0606"
    key    = "bedrock/terraform.tfstate"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Provider - Tokyo
# ----------------------------------------------------------------------------------------------
provider "aws" {
  region = "ap-northeast-1"
}

# ----------------------------------------------------------------------------------------------
# AWS Provider - Virginia
# ----------------------------------------------------------------------------------------------
provider "aws" {
  alias  = "global"
  region = "us-east-1"
}

# ----------------------------------------------------------------------------------------------
# WAF - IP Restrictions
# ----------------------------------------------------------------------------------------------
module "waf" {
  source = "./waf"
  providers = {
    aws = aws.global
  }

  prefix             = local.prefix
  allow_ip_addresses = var.allow_ip_addresses
}

# ----------------------------------------------------------------------------------------------
# Authentication
# ----------------------------------------------------------------------------------------------
module "auth" {
  source = "./auth"
  prefix = local.prefix
}

# ----------------------------------------------------------------------------------------------
# Contents Delivery Network
# ----------------------------------------------------------------------------------------------
module "cdn" {
  source      = "./cdn"
  prefix      = local.prefix
  suffix      = local.suffix
  web_acl_arn = module.waf.web_acl_arn_ip_restrictions
}

# ----------------------------------------------------------------------------------------------
# Database
# ----------------------------------------------------------------------------------------------
module "database" {
  source = "./database"
  prefix = local.prefix
}

# ----------------------------------------------------------------------------------------------
# ECS Application
# ----------------------------------------------------------------------------------------------
module "app" {
  source = "./app"
  prefix = local.prefix
}


# ----------------------------------------------------------------------------------------------
# REST API
# ----------------------------------------------------------------------------------------------
module "api" {
  source                                  = "./api"
  prefix                                  = local.prefix
  vpc_id                                  = module.app.vpc_id
  vpc_private_subnets                     = module.app.vpc_private_subnets
  bucket_name_artifact                    = aws_s3_bucket.artifact.bucket
  service_discovery_service_chat_arn      = module.app.service_discovery_service_chat_arn
  service_discovery_service_functions_arn = module.app.service_discovery_service_functions_arn
  service_discovery_service_rag_arn       = module.app.service_discovery_service_rag_arn
}

# ----------------------------------------------------------------------------------------------
# ECS Application
# ----------------------------------------------------------------------------------------------
module "datasources" {
  source = "./datasources"
  count  = var.rag_enable ? 1 : 0

  prefix                     = local.prefix
  suffix                     = local.suffix
  cognito_user_pool_endpoint = module.auth.cognito_user_pool_endpoint
}
