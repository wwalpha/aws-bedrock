# ----------------------------------------------------------------------------------------------
# AWS KMS Key for Lambda Environment Variable Encryption
# ----------------------------------------------------------------------------------------------
resource "aws_kms_key" "lambda_env" {
  description             = "KMS key for encrypting Lambda environment variables (bedrock)"
  deletion_window_in_days = 7

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "EnableIAMUserPermissions",
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${local.account_id}:root"
        },
        Action   = "kms:*",
        Resource = "*"
      },
      {
        Sid    = "AllowLambdaExecutionRoleUseOfTheKey",
        Effect = "Allow",
        Principal = {
          AWS = aws_iam_role.cognito_post_signup_lambda_role.arn
        },
        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ],
        Resource = "*"
      },
      {
        Sid    = "AllowLambdaServiceGrant",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = [
          "kms:CreateGrant",
          "kms:ListGrants",
          "kms:RevokeGrant"
        ],
        Resource = "*",
        Condition = {
          Bool = { "kms:GrantIsForAWSResource" = true }
        }
      }
    ]
  })
}

resource "aws_kms_alias" "lambda_env" {
  name          = "alias/${local.prefix}-lambda-env"
  target_key_id = aws_kms_key.lambda_env.key_id
}
