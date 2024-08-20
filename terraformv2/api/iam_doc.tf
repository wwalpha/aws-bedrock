# ----------------------------------------------------------------------------------------------
# AWS IAM Policy Document - Lambda
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy Document - API Gateway
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "apigw" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Policy Document - ECS Tasks
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "ecs_task" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
