# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "this" {
  name = "${local.prefix}_UserPool"

  auto_verified_attributes = ["email"]
  mfa_configuration        = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
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
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "this" {
  name = "SPAClient"

  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

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
    "http://localhost:3000/auth/callback",
  ]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}
