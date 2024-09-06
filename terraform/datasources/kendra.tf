# ----------------------------------------------------------------------------------------------
# AWS Kendra Index
# ----------------------------------------------------------------------------------------------
resource "aws_kendra_index" "this" {
  name                = "${var.prefix}-rag-index"
  edition             = "DEVELOPER_EDITION"
  role_arn            = aws_iam_role.rag_datasource.arn
  user_context_policy = "USER_TOKEN"

  user_group_resolution_configuration {
    user_group_resolution_mode = "NONE"
  }

  user_token_configurations {
    jwt_token_type_configuration {
      key_location              = "URL"
      url                       = "${var.cognito_user_pool_endpoint}/.well-known/jwks.json"
      user_name_attribute_field = "cognito:username"
      group_attribute_field     = "cognito:groups"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Kendra Data Source
# ----------------------------------------------------------------------------------------------
resource "aws_kendra_data_source" "this" {
  index_id      = aws_kendra_index.this.id
  name          = "s3_datasource"
  type          = "S3"
  role_arn      = aws_iam_role.rag_datasource.arn
  language_code = "ja"

  configuration {
    s3_configuration {
      bucket_name = aws_s3_bucket.datasource.id

      inclusion_prefixes = [
        "docs"
      ]

      access_control_list_configuration {
      }

      documents_metadata_configuration {
      }
    }
  }
}
