# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "this" {
  name = "${var.prefix}_UserPool"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]
  mfa_configuration        = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_email"
      priority = 2
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
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

  password_policy {
    temporary_password_validity_days = 7
    minimum_length                   = 10
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_client" "this" {
  name                                 = "${aws_cognito_user_pool.this.name}Client"
  user_pool_id                         = aws_cognito_user_pool.this.id
  generate_secret                      = false
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]

  id_token_validity = 1440
  token_validity_units {
    id_token = "minutes"
  }

  //TODO: Add callback_urls and logout_urls
  callback_urls = [
    "https://exmaple.com/"
  ]
  # logout_urls = [
  #   "https://admin.${local.domain_name}/logout"
  # ]
  supported_identity_providers = ["COGNITO"]
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool" "this" {
  identity_pool_name               = "${var.prefix}_IdentityPool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.this.id
    provider_name           = aws_cognito_user_pool.this.endpoint
    server_side_token_check = true
  }
}
