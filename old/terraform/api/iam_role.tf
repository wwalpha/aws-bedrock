# ----------------------------------------------------------------------------------------------
# AWS IAM Role - API Gateway Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "authorizer" {
  name               = "${var.prefix}_APIGatewayAuthorizerRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - API Service
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "authorizer" {
  role       = aws_iam_role.authorizer.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - API Gateway CloudWatch Logs
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "apigw_cloudwatch_logs" {
  name               = "${var.prefix}_APIGWCloudWatchLogsRole"
  assume_role_policy = data.aws_iam_policy_document.apigw.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - API Gateway CloudWatch Logs
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "apigw_cloudwatch_logs" {
  role       = aws_iam_role.apigw_cloudwatch_logs.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}
