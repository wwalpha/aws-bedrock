# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Bedrock Knowledge Base
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "bedrock_kb_role" {
  name               = "${var.project_name}_bedrock_kb_role"
  assume_role_policy = data.aws_iam_policy_document.bedrock_kb_trust.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - S3 Read for Knowledge Base Ingestion
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "bedrock_kb_s3_policy" {
  name = "BedrockKBS3Read"
  role = aws_iam_role.bedrock_kb_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:ListBucket"]
        Resource = [
          aws_s3_bucket.knowledge.arn,
          "${aws_s3_bucket.knowledge.arn}/${local.bedrock_kb_s3_prefix_raw}*"
        ]
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - OpenSearch Serverless access for Knowledge Base Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "bedrock_kb_aoss_policy" {
  name = "BedrockKBAOSSPermissions"
  role = aws_iam_role.bedrock_kb_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["aoss:*"]
        Resource = "*"
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# OpenSearch Serverless Security Policy - Encryption
# ----------------------------------------------------------------------------------------------
resource "aws_opensearchserverless_security_policy" "kb_encryption" {
  name = "${var.project_name}-kb-encryption"
  type = "encryption"
  # Encryption policy schema expects AWSOwnedKey at top level and each rule to include ResourceType
  policy = jsonencode({
    Rules = [{
      ResourceType = "collection"
      Resource     = ["collection/${local.bedrock_kb_os_collection}"]
    }]
    AWSOwnedKey = true
  })
}

# ----------------------------------------------------------------------------------------------
# OpenSearch Serverless Security Policy - Network (Public Access)
# ----------------------------------------------------------------------------------------------
resource "aws_opensearchserverless_security_policy" "kb_network" {
  name = "${var.project_name}-kb-network"
  type = "network"
  # Network policy JSON must be an array of statements; each statement contains Rules (with ResourceType) and AllowFromPublic
  policy = jsonencode([
    {
      Rules = [{
        ResourceType = "collection"
        Resource     = ["collection/${local.bedrock_kb_os_collection}"]
      }]
      AllowFromPublic = true
    }
  ])
}

# ----------------------------------------------------------------------------------------------
# OpenSearch Serverless Collection - VECTORSEARCH
# ----------------------------------------------------------------------------------------------
resource "aws_opensearchserverless_collection" "kb" {
  name       = local.bedrock_kb_os_collection
  type       = "VECTORSEARCH"
  depends_on = [aws_opensearchserverless_security_policy.kb_encryption, aws_opensearchserverless_security_policy.kb_network]
}

# ----------------------------------------------------------------------------------------------
# OpenSearch Serverless Access Policy - Bedrock Role
# ----------------------------------------------------------------------------------------------
resource "aws_opensearchserverless_access_policy" "kb_access" {
  name = "${var.project_name}-kb-access"
  type = "data"
  # Access policy JSON array; use valid permission groups per resource type
  policy = jsonencode([
    {
      Rules = [
        {
          ResourceType = "collection"
          Resource     = ["collection/${aws_opensearchserverless_collection.kb.name}"]
          Permission   = ["aoss:*"]
        },
        {
          ResourceType = "index"
          Resource     = ["index/${aws_opensearchserverless_collection.kb.name}/*"]
          Permission   = ["aoss:*"]
        }
      ]
      Principal = [aws_iam_role.bedrock_kb_role.arn]
    }
  ])
}
