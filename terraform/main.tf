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

terraform {
  backend "local" {
    path = "./tfstate/terraform.tfstate"
  }
}

module "us_east_1" {
  source = "./us-east-1"
  providers = {
    aws = aws.global
  }

  prefix             = local.prefix
  allow_ip_addresses = var.allow_ip_addresses
}
