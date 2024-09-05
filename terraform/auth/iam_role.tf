# ----------------------------------------------------------------------------------------------
# Cognito Authenticated Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "authenticated" {
  name = "${var.prefix}_CognitoAuthenticatedRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.this.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}

# ----------------------------------------------------------------------------------------------
# AWS Role Policy - Cogonito Authenticated
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "authenticated" {
  name = "${var.prefix}_CognitoAuthenticatedPolicy"
  role = aws_iam_role.authenticated.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "transcribe:StartStreamTranscriptionWebSocket"
        ]
        Resource = ["*"]
      },
      {
        Effect   = "Deny"
        Action   = "*"
        Resource = ["*"]
        Condition = {
          NotIpAddress = {
            "aws:SourceIp" = [
              "0.0.0.0/1",
              "128.0.0.0/1",
              "::/1",
              "8000::/1"
            ]
          }
        }
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# Cognito Authenticated Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "unauthenticated" {
  name = "${var.prefix}_CognitoUnauthenticatedRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.this.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
EOF
}

# ----------------------------------------------------------------------------------------------
# Cognito Authenticated Role Policy
# ----------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool_roles_attachment" "authenticated" {
  identity_pool_id = aws_cognito_identity_pool.this.id

  roles = {
    "authenticated"   = aws_iam_role.authenticated.arn
    "unauthenticated" = aws_iam_role.unauthenticated.arn
  }
}
