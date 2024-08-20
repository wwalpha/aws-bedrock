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

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - ECS Task
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task" {
  name               = "${var.prefix}_ECSTaskRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - ECS Task Execution
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_exec" {
  name               = "${var.prefix}_ECSTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - ECS Task Execution
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_default" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
