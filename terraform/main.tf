# ----------------------------------------------------------------------------------------------
# AWS Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    bucket = "terraform-state-202106"
    key    = "bedrock/main.state"
    region = "us-east-1"
    acl    = "bucket-owner-full-control"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}


module "app" {
  source = "./app"

  prefix = local.prefix
  suffix = local.suffix
}
