# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Rag Data Source
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "rag_datasource" {
  name               = "${var.prefix}_RagDataSourceRole"
  assume_role_policy = data.aws_iam_policy_document.kendra.json

  inline_policy {
    name = "RagDataSourceRoleDefaultPolicy"

    policy = jsonencode({
      Version = "2012-10-17",
      Statement = [
        {
          Effect = "Allow",
          Action = [
            "s3:GetObject",
            "s3:ListBucket",
          ],
          Resource = "*"
        },
        {
          Effect = "Allow",
          Action = [
            "kendra:BatchDeleteDocument",
            "kendra:BatchPutDocument"
          ],
          Resource = "*"
        },
      ],
    })
  }


  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Rag Index
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "rag_index" {
  name               = "${var.prefix}_RagIndexRole"
  assume_role_policy = data.aws_iam_policy_document.kendra.json

  inline_policy {
    name = "RagKendraIndexRoleDefaultPolicy"

    policy = jsonencode({
      Version = "2012-10-17",
      Statement = [
        {
          Effect = "Allow",
          Action = [
            "s3:GetObject",
          ],
          Resource = "*"
        }
      ],
    })
  }

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Rag Index
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "rag_index" {
  role       = aws_iam_role.rag_index.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}
