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
