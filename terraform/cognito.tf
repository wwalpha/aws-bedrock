resource "aws_cognito_user_pool" "this" {
  name                     = "${local.prefix}_UserPool"
  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]
  mfa_configuration        = "OPTIONAL"

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  software_token_mfa_configuration {
    enabled = true
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_signup.arn
  }
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "this" {
  name                                 = "SPAClient"
  user_pool_id                         = aws_cognito_user_pool.this.id
  generate_secret                      = false
  supported_identity_providers         = ["COGNITO"]
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  callback_urls = [
    "http://localhost:5173/callback",
  ]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client Domain
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_domain" "this" {
  domain                = "bedrock${aws_cognito_user_pool_client.this.id}"
  user_pool_id          = aws_cognito_user_pool.this.id
  managed_login_version = 2
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Managed Login Branding
# --------------------------------------------------------------------------------------------------------------
resource "awscc_cognito_managed_login_branding" "this" {
  user_pool_id = aws_cognito_user_pool.this.id
  client_id    = aws_cognito_user_pool_client.this.id

  settings = jsonencode({
  })

  lifecycle {
    ignore_changes = [
      settings,
    ]
  }
}

