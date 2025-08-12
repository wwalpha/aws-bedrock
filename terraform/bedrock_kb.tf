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
        Effect = "Allow"
        Action = [
          "aoss:CreateCollectionItems",
          "aoss:DeleteCollectionItems",
          "aoss:UpdateCollectionItems",
          "aoss:DescribeCollectionItems",
          "aoss:CreateIndex",
          "aoss:DeleteIndex",
          "aoss:UpdateIndex",
          "aoss:DescribeIndex",
          "aoss:ReadDocument",
          "aoss:WriteDocument"
        ]
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
          Permission = [
            "aoss:DescribeCollectionItems",
            "aoss:CreateCollectionItems",
            "aoss:UpdateCollectionItems",
            "aoss:DeleteCollectionItems"
          ]
        },
        {
          ResourceType = "index"
          Resource     = ["index/${aws_opensearchserverless_collection.kb.name}/*"]
          Permission = [
            "aoss:CreateIndex",
            "aoss:DeleteIndex",
            "aoss:UpdateIndex",
            "aoss:DescribeIndex",
            "aoss:ReadDocument",
            "aoss:WriteDocument"
          ]
        }
      ]
      Principal = [aws_iam_role.bedrock_kb_role.arn]
    }
  ])
}

# ----------------------------------------------------------------------------------------------
# Wait for OpenSearch collection stabilization (simple sleep) before KB creation
# ----------------------------------------------------------------------------------------------
resource "null_resource" "wait_opensearch_ready" {
  depends_on = [
    aws_opensearchserverless_collection.kb,
    aws_opensearchserverless_access_policy.kb_access
  ]

  provisioner "local-exec" {
    command = "sleep 60"
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon Bedrock Knowledge Base
# ----------------------------------------------------------------------------------------------
resource "aws_bedrockagent_knowledge_base" "kb" {
  name     = local.bedrock_kb_name
  role_arn = aws_iam_role.bedrock_kb_role.arn

  knowledge_base_configuration {
    type = "VECTOR"
    vector_knowledge_base_configuration {
      # Region hard-coded fallback ap-northeast-1; ensure provider region
      embedding_model_arn = "arn:aws:bedrock:ap-northeast-1::foundation-model/${var.bedrock_kb_embedding_model_id}"
    }
  }

  storage_configuration {
    type = "OPENSEARCH_SERVERLESS"
    opensearch_serverless_configuration {
      collection_arn    = aws_opensearchserverless_collection.kb.arn
      vector_index_name = local.bedrock_kb_vector_index
      field_mapping {
        metadata_field = "metadata"
        text_field     = "text"
        vector_field   = "vector"
      }
    }
  }

  depends_on = [
    null_resource.wait_opensearch_ready,
    aws_opensearchserverless_security_policy.kb_encryption,
    aws_opensearchserverless_security_policy.kb_network
  ]
}

# ----------------------------------------------------------------------------------------------
# Amazon Bedrock Knowledge Base Data Source - S3
# ----------------------------------------------------------------------------------------------
resource "aws_bedrockagent_data_source" "kb_s3" {
  knowledge_base_id = aws_bedrockagent_knowledge_base.kb.id
  name              = "kb-s3"

  data_source_configuration {
    type = "S3"
    s3_configuration {
      bucket_arn         = aws_s3_bucket.knowledge.arn
      inclusion_prefixes = [local.bedrock_kb_s3_prefix_raw]
    }
  }
}

