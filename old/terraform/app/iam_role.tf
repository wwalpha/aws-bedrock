# ----------------------------------------------------------------------------------------------
# AWS IAM Role - ECS Task
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task" {
  name               = "${var.prefix}_ECSTaskRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task.json

  inline_policy {
    name = "CloudWatchLogsPolicy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
          Resource = ["*"]
        }
      ]
    })
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - ECS Task Execution
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_exec" {
  name               = "${var.prefix}_ECSTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_task.json

  inline_policy {
    name = "CloudWatchLogsPolicy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
          Resource = ["*"]
        }
      ]
    })
  }

  inline_policy {
    name = "S3ArtifactsPolicy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "s3:GetObject"
          ]
          Resource = [
            "arn:aws:s3:::${var.bucket_name_artifacts}/*"
          ]
        }
      ]
    })
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - ECS Task Execution
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_default" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - ECS Task Execution SSM
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "ecs_task_exec_ssm" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}
