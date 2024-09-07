# ----------------------------------------------------------------------------------------------
# Lambda Function - Authorizer v2
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "authorizer_v2" {
  function_name     = "${var.prefix}-authorizer-v2"
  s3_bucket         = aws_s3_object.apigw_authorizer.bucket
  s3_key            = aws_s3_object.apigw_authorizer.key
  s3_object_version = aws_s3_object.apigw_authorizer.version_id
  handler           = local.lambda_handler
  runtime           = local.lambda_runtime_nodejs_20
  memory_size       = 128
  role              = aws_iam_role.authorizer.arn
  timeout           = 3

  environment {
    variables = {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Permission - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "authorizer_v2" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer_v2.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/authorizers/${aws_apigatewayv2_authorizer.this.id}"
}
