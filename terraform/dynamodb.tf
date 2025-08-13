# ----------------------------------------------------------------------------------------------
# DynamoDB Table - Chat Histroy
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "chat_history" {
  name         = "${local.prefix}_chat_history"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "chat_id"
  range_key    = "timestamp"

  attribute {
    name = "chat_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  # Additional attribute for per-user listing GSI
  attribute {
    name = "user_id"
    type = "S"
  }

  # GSI to list chats by type (e.g., meta) sorted by timestamp
  global_secondary_index {
    name            = "gsi_user_timestamp"
    hash_key        = "user_id"
    range_key       = "timestamp"
    projection_type = "ALL"
  }
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Table - User
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "user_table" {
  name         = "${local.prefix}_user"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Table - Knowledge (per-user partition)
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "knowledge" {
  name         = "${local.prefix}_knowledge"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"
  range_key    = "knowledge_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "knowledge_id"
    type = "S"
  }
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Table - Conversations (per user conversation metadata)
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "conversations" {
  name         = "${local.prefix}_conversations"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"
  range_key    = "chat_id"

  attribute {
    name = "user_id"
    type = "S"
  }
  attribute {
    name = "chat_id"
    type = "S"
  }
}
