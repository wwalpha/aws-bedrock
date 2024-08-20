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


module "database" {
  source = "./database"
  prefix = local.prefix
}


module "app" {
  source               = "./app"
  prefix               = local.prefix
  bucket_file_arn      = module.database.bucket_file_arn
  bucket_name_file     = module.database.bucket_name_file
  bucket_name_material = module.database.bucket_name_material
  dynamodb_table_name  = module.database.dynamodb_table_name
}
