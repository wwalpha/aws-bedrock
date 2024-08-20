locals {
  # --------------------------------------------------------------------------------------------------------------
  # App Settings
  # --------------------------------------------------------------------------------------------------------------
  account_id = data.aws_caller_identity.this.account_id
  region     = data.aws_region.this.name


  # --------------------------------------------------------------------------------------------------------------
  # Lambda function settings
  # --------------------------------------------------------------------------------------------------------------
  lambda_handler             = "index.handler"
  lambda_runtime_nodejs_20   = "nodejs20.x"
  image_generation_model_ids = "['stability.stable-diffusion-xl-v1']"
  model_ids                  = "['anthropic.claude-3-sonnet-20240229-v1:0', 'anthropic.claude-3-haiku-20240307-v1:0']"
  model_region               = "us-west-2"

  # --------------------------------------------------------------------------------------------------------------
  # API Gateway
  # --------------------------------------------------------------------------------------------------------------
  apigw_id         = aws_api_gateway_rest_api.this.id
  apigw_stage      = aws_api_gateway_stage.this.stage_name
  apigw_source_arn = "arn:aws:execute-api:${local.region}:${local.account_id}:${local.apigw_id}"
}

# ----------------------------------------------------------------------------------------------
# AWS Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS Account
# ----------------------------------------------------------------------------------------------
data "aws_caller_identity" "this" {}
