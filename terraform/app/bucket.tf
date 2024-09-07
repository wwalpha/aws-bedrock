# ----------------------------------------------------------------------------------------------
# Chat Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "chat" {
  bucket  = var.bucket_name_artifacts
  key     = "envs/chat.env"
  content = <<EOT
TALBE_NAME=${var.table_name}
EOT
}

# ----------------------------------------------------------------------------------------------
# Functions Service Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "functions" {
  bucket  = var.bucket_name_artifacts
  key     = "envs/functions.env"
  content = <<EOT
TALBE_NAME=${var.table_name}
EOT
}
