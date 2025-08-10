# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Cognito Post Confirmation Trigger
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cognito_post_signup" {
  function_name    = "${local.prefix}_cognito_post_signup"
  role             = aws_iam_role.cognito_post_signup_lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  filename         = data.archive_file.default.output_path
  source_code_hash = data.archive_file.default.output_base64sha256
  timeout          = 10

  environment {
    variables = {
      USER_TABLE_NAME = aws_dynamodb_table.user_table.name
    }
  }

  # TerraformはdistのZipのみを参照。ビルドはTerraformの外で実行してください。
}

## ビルドは外部で実行（例: npm run build）。TerraformはZipを配備するだけ。

# ----------------------------------------------------------------------------------------------
# AWS Lambda Permission - Allow Cognito to Invoke Lambda
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "allow_cognito_invoke" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_signup.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.this.arn
}
