# ----------------------------------------------------------------------------------------------
# Lambda Function - Predict
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "predict" {
  function_name     = "${var.prefix}-api-predict"
  s3_bucket         = aws_s3_object.predict.bucket
  s3_key            = aws_s3_object.predict.key
  s3_object_version = aws_s3_object.predict.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      IMAGE_GENERATION_MODEL_IDS = local.image_generation_model_ids
      MODEL_IDS                  = local.model_ids
      MODEL_REGION               = local.model_region
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - Predict
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "predict" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.predict.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.apigw_source_arn}/*/${module.predict_post.http_method}/${aws_api_gateway_resource.predict.path}"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Predict Stream
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "predict_stream" {
  function_name     = "${var.prefix}-api-predict-stream"
  s3_bucket         = aws_s3_object.predict_stream.bucket
  s3_key            = aws_s3_object.predict_stream.key
  s3_object_version = aws_s3_object.predict_stream.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      BUCKET_NAME                = var.bucket_name_file
      AGENT_REGION               = "us-east-1"
      AGENT_MAP                  = "{}"
      IMAGE_GENERATION_MODEL_IDS = local.image_generation_model_ids
      MODEL_IDS                  = local.model_ids
      MODEL_REGION               = local.model_region
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Predict Title
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "predict_title" {
  function_name     = "${var.prefix}-api-predict-title"
  s3_bucket         = aws_s3_object.predict_title.bucket
  s3_key            = aws_s3_object.predict_title.key
  s3_object_version = aws_s3_object.predict_title.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME                 = var.dynamodb_table_name
      IMAGE_GENERATION_MODEL_IDS = local.image_generation_model_ids
      MODEL_IDS                  = local.model_ids
      MODEL_REGION               = local.model_region
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - Predict Title
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "predict_title" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.predict.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.apigw_source_arn}/*/${module.predict_title_post.http_method}/${aws_api_gateway_resource.predict_title.path}"
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - Generate Image
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "generate_image" {
  function_name     = "${var.prefix}-api-generate-image"
  s3_bucket         = aws_s3_object.generate_image.bucket
  s3_key            = aws_s3_object.generate_image.key
  s3_object_version = aws_s3_object.generate_image.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      IMAGE_GENERATION_MODEL_IDS = local.image_generation_model_ids
      MODEL_IDS                  = local.model_ids
      MODEL_REGION               = local.model_region
    }
  }
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - Create Chat
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "create_chat" {
  function_name     = "${var.prefix}-api-create-chat"
  s3_bucket         = aws_s3_object.create_chat.bucket
  s3_key            = aws_s3_object.create_chat.key
  s3_object_version = aws_s3_object.create_chat.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - Create Chat
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "create_chat" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_chat.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.apigw_source_arn}/*/${module.chats_post.http_method}/${aws_api_gateway_resource.chats.path}"
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - Delete Chat
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "delete_chat" {
  function_name     = "${var.prefix}-api-delete-chat"
  s3_bucket         = aws_s3_object.delete_chat.bucket
  s3_key            = aws_s3_object.delete_chat.key
  s3_object_version = aws_s3_object.delete_chat.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - Create Message
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "create_message" {
  function_name     = "${var.prefix}-api-create-message"
  s3_bucket         = aws_s3_object.create_message.bucket
  s3_key            = aws_s3_object.create_message.key
  s3_object_version = aws_s3_object.create_message.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Update Chat Title
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "update_chat_title" {
  function_name     = "${var.prefix}-api-update-chat-title"
  s3_bucket         = aws_s3_object.update_chat_title.bucket
  s3_key            = aws_s3_object.update_chat_title.key
  s3_object_version = aws_s3_object.update_chat_title.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - List Chats
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "list_chats" {
  function_name     = "${var.prefix}-api-list-charts"
  s3_bucket         = aws_s3_object.list_chats.bucket
  s3_key            = aws_s3_object.list_chats.key
  s3_object_version = aws_s3_object.list_chats.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Permission (Lambda) - List Chats
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "list_chats" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_chats.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.apigw_source_arn}/*/${module.chats_get.http_method}/${aws_api_gateway_resource.chats.path}"
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - Find Chat by Id
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "find_chat_by_id" {
  function_name     = "${var.prefix}-api-find-chat-by-id"
  s3_bucket         = aws_s3_object.find_chat_by_id.bucket
  s3_key            = aws_s3_object.find_chat_by_id.key
  s3_object_version = aws_s3_object.find_chat_by_id.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - List Messages
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "list_messages" {
  function_name     = "${var.prefix}-api-list-messages"
  s3_bucket         = aws_s3_object.list_messages.bucket
  s3_key            = aws_s3_object.list_messages.key
  s3_object_version = aws_s3_object.list_messages.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Update Feedback
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "update_feedback" {
  function_name     = "${var.prefix}-api-update-feedback"
  s3_bucket         = aws_s3_object.update_feedback.bucket
  s3_key            = aws_s3_object.update_feedback.key
  s3_object_version = aws_s3_object.update_feedback.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Get WebText Service
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "get_webtext" {
  function_name     = "${var.prefix}-api-get-web-text"
  s3_bucket         = aws_s3_object.get_webtext.bucket
  s3_key            = aws_s3_object.get_webtext.key
  s3_object_version = aws_s3_object.get_webtext.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Create Share Id
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "create_share_id" {
  function_name     = "${var.prefix}-api-create-share-id"
  s3_bucket         = aws_s3_object.create_share_id.bucket
  s3_key            = aws_s3_object.create_share_id.key
  s3_object_version = aws_s3_object.create_share_id.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Get Shared Chat
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "get_shared_chat" {
  function_name     = "${var.prefix}-api-get-shared-chat"
  s3_bucket         = aws_s3_object.get_shared_chat.bucket
  s3_key            = aws_s3_object.get_shared_chat.key
  s3_object_version = aws_s3_object.get_shared_chat.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Find Share Id
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "find_share_id" {
  function_name     = "${var.prefix}-api-find-share-id"
  s3_bucket         = aws_s3_object.find_share_id.bucket
  s3_key            = aws_s3_object.find_share_id.key
  s3_object_version = aws_s3_object.find_share_id.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Delete Share Id
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "delete_share_id" {
  function_name     = "${var.prefix}-api-delete-share-id"
  s3_bucket         = aws_s3_object.delete_share_id.bucket
  s3_key            = aws_s3_object.delete_share_id.key
  s3_object_version = aws_s3_object.delete_share_id.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - List System Contexts
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "list_system_contexts" {
  function_name     = "${var.prefix}-api-list-system-contexts"
  s3_bucket         = aws_s3_object.list_system_contexts.bucket
  s3_key            = aws_s3_object.list_system_contexts.key
  s3_object_version = aws_s3_object.list_system_contexts.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Create System Contexts
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "create_system_contexts" {
  function_name     = "${var.prefix}-api-create-system-contexts"
  s3_bucket         = aws_s3_object.create_system_contexts.bucket
  s3_key            = aws_s3_object.create_system_contexts.key
  s3_object_version = aws_s3_object.create_system_contexts.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}


# ----------------------------------------------------------------------------------------------
# Lambda Function - Update System Context Title
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "update_system_context_title" {
  function_name     = "${var.prefix}-api-update-system-context-title"
  s3_bucket         = aws_s3_object.update_system_context_title.bucket
  s3_key            = aws_s3_object.update_system_context_title.key
  s3_object_version = aws_s3_object.update_system_context_title.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Delete System Contexts
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "delete_system_contexts" {
  function_name     = "${var.prefix}-api-delete-system-contexts"
  s3_bucket         = aws_s3_object.delete_system_contexts.bucket
  s3_key            = aws_s3_object.delete_system_contexts.key
  s3_object_version = aws_s3_object.delete_system_contexts.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Get Signed Url
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "get_signed_url" {
  function_name     = "${var.prefix}-api-get-signed-url"
  s3_bucket         = aws_s3_object.get_signed_url.bucket
  s3_key            = aws_s3_object.get_signed_url.key
  s3_object_version = aws_s3_object.get_signed_url.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900

  environment {
    variables = {
      BUCKET_NAME = var.bucket_name_file
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Get FileDownload Signed Url
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "get_file_download_signed_url" {
  function_name     = "${var.prefix}-api-get-file-download-signed-url"
  s3_bucket         = aws_s3_object.get_file_download_signed_url.bucket
  s3_key            = aws_s3_object.get_file_download_signed_url.key
  s3_object_version = aws_s3_object.get_file_download_signed_url.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Delete File Function
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "delete_file_function" {
  function_name     = "${var.prefix}-api-delete-file-function"
  s3_bucket         = aws_s3_object.delete_file_function.bucket
  s3_key            = aws_s3_object.delete_file_function.key
  s3_object_version = aws_s3_object.delete_file_function.version_id
  handler           = local.lambda_handler
  memory_size       = 128
  role              = aws_iam_role.api_service.arn
  runtime           = local.lambda_runtime_nodejs_20
  timeout           = 900
}

