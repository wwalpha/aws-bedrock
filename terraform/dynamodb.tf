# ----------------------------------------------------------------------------------------------
# DynamoDB Table - Chat Histroy
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "chat_history" {
  name         = "${local.prefix}_chat_history"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "session_id"
  range_key    = "timestamp"

  attribute {
    name = "session_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }
}
