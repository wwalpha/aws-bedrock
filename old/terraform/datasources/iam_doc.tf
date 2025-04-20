# ----------------------------------------------------------------------------------------------
# AWS IAM Policy Document - Kendra
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "kendra" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["kendra.amazonaws.com"]
    }
  }
}
