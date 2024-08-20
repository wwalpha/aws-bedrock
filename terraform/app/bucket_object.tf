# ----------------------------------------------------------------------------------------------
# Archive file - Lambda default module
# ----------------------------------------------------------------------------------------------
data "archive_file" "lambda_default" {
  type        = "zip"
  output_path = "${path.module}/dist/default.zip"

  source {
    content  = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT
    filename = "index.js"
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Predict
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "predict" {
  bucket = var.bucket_name_material
  key    = "modules/predict.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Predict stream
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "predict_stream" {
  bucket = var.bucket_name_material
  key    = "modules/predict_stream.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Predict Title
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "predict_title" {
  bucket = var.bucket_name_material
  key    = "modules/predict_title.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Generate Image
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "generate_image" {
  bucket = var.bucket_name_material
  key    = "modules/generate_image.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Create Chat
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "create_chat" {
  bucket = var.bucket_name_material
  key    = "modules/create_chat.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}


# ----------------------------------------------------------------------------------------------
# S3 Object - Delete Chat
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "delete_chat" {
  bucket = var.bucket_name_material
  key    = "modules/delete_chat.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}



# ----------------------------------------------------------------------------------------------
# S3 Object - Create Message
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "create_message" {
  bucket = var.bucket_name_material
  key    = "modules/create_message.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Update Chat Title
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "update_chat_title" {
  bucket = var.bucket_name_material
  key    = "modules/update_chat_title.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - List Chats
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "list_chats" {
  bucket = var.bucket_name_material
  key    = "modules/list_chats.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Find Chat by Id
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "find_chat_by_id" {
  bucket = var.bucket_name_material
  key    = "modules/find_chat_by_id.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - List Messages
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "list_messages" {
  bucket = var.bucket_name_material
  key    = "modules/list_messages.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Update Feedback
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "update_feedback" {
  bucket = var.bucket_name_material
  key    = "modules/update_feedback.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Get WebText Service
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "get_webtext" {
  bucket = var.bucket_name_material
  key    = "modules/get_webtext.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Create Share Id
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "create_share_id" {
  bucket = var.bucket_name_material
  key    = "modules/create_share_id.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Get Shared Chat
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "get_shared_chat" {
  bucket = var.bucket_name_material
  key    = "modules/get_shared_chat.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Find Share Id
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "find_share_id" {
  bucket = var.bucket_name_material
  key    = "modules/find_share_id.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Delete Share Id
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "delete_share_id" {
  bucket = var.bucket_name_material
  key    = "modules/delete_share_id.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - List System Contexts
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "list_system_contexts" {
  bucket = var.bucket_name_material
  key    = "modules/list_system_contexts.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Create System Contexts
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "create_system_contexts" {
  bucket = var.bucket_name_material
  key    = "modules/create_system_contexts.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Update System Context Title
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "update_system_context_title" {
  bucket = var.bucket_name_material
  key    = "modules/update_system_context_title.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}


# ----------------------------------------------------------------------------------------------
# S3 Object - DeleteSystemContexts
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "delete_system_contexts" {
  bucket = var.bucket_name_material
  key    = "modules/delete_system_contexts.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Get Signed Url
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "get_signed_url" {
  bucket = var.bucket_name_material
  key    = "modules/get_signed_url.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Get FileDownload Signed Url
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "get_file_download_signed_url" {
  bucket = var.bucket_name_material
  key    = "modules/get_file_download_signed_url.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}


# ----------------------------------------------------------------------------------------------
# S3 Object - Delete File Function
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "delete_file_function" {
  bucket = var.bucket_name_material
  key    = "modules/delete_file_function.zip"
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}
