# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Database
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "this" {
  name         = "${var.prefix}-database"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "createdDate"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdDate"
    type = "S"
  }

  attribute {
    name = "feedback"
    type = "S"
  }

  global_secondary_index {
    name            = "FeedbackIndex"
    hash_key        = "feedback"
    projection_type = "ALL"
  }
}
