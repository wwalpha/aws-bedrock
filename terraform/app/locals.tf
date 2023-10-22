locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  environment = terraform.workspace
  is_dev      = local.environment == "dev"

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  api_stage_name = "v1"
  # api_allow_origins = [
  #   "https://www.${local.remote_setup.route53_zone_name}",
  #   "https://admin.${local.remote_setup.route53_zone_name}"
  # ]
  # api_allow_origins_dev = concat(local.api_allow_origins, ["http://localhost:3000"])

  # ----------------------------------------------------------------------------------------------
  # Lambda
  # ----------------------------------------------------------------------------------------------
  lambda_handler            = "lambda_function.lambda_handler"
  lambda_runtime_python3_11 = "python3.11"
  lambda_basic_policy_arn   = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

}
