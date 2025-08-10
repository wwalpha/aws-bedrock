# ----------------------------------------------------------------------------------------------
# AWS IAM Policy Document - ECS Tasks
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "ecs_task_document" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role - ECS Tasks
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task" {
  name               = "${local.prefix}_ECSTaskRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_document.json
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_cloudwatch" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_exec" {
  name               = "${local.prefix}_ECSTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_document.json
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - ECS Task Execution Default Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_default" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - CloudWatch Logs Basic (CreateGroup, CreateStream, PutEvents)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_cloudwatch" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = aws_iam_policy.cloudwatch_logs_basic.arn
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - ECS Task Execution S3 Objects
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task_exec_s3_objects" {
  name = "S3ObjectsPolicy"
  role = aws_iam_role.ecs_task_exec.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "arn:aws:s3:::${aws_s3_bucket.materials.bucket}/*"
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Lambda for Cognito Post Confirmation Trigger
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cognito_post_signup_lambda_role" {
  name = "${local.prefix}_cognito_post_signup_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Lambda for Cognito Post Confirmation Trigger
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "cognito_post_signup_lambda_policy" {
  name = "${local.prefix}_cognito_post_signup_lambda_policy"
  role = aws_iam_role.cognito_post_signup_lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem"
        ]
        Resource = aws_dynamodb_table.user_table.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}
