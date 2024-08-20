# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - File
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "file" {
  bucket = local.bucket_name_api_file
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket CORS Configuration - File
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_cors_configuration" "file" {
  bucket = aws_s3_bucket.file.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket Policy - File
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "file" {
  bucket = aws_s3_bucket.file.id
  policy = data.aws_iam_policy_document.file.json
}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - File
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "file" {
  statement {
    effect = "Deny"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:*",
    ]

    resources = [
      aws_s3_bucket.file.arn,
      "${aws_s3_bucket.file.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }

  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::334678299258:role/GenerativeAiUseCasesStack-CustomS3AutoDeleteObjects-R51wY7tmChaz"]
    }

    actions = [
      "s3:DeleteObject*",
      "s3:GetBucket*",
      "s3:List*",
      "s3:PutBucketPolicy"
    ]

    resources = [
      aws_s3_bucket.file.arn,
      "${aws_s3_bucket.file.arn}/*",
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - File
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "materials" {
  bucket = local.bucket_name_materials
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Transcribe Audio
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "transcribe_audio" {
  bucket = local.bucket_name_transcribe_audio
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket CORS Configuration - Transcribe Audio
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_cors_configuration" "transcribe_audio" {
  bucket = aws_s3_bucket.transcribe_audio.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket Policy - Transcribe Audio
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "transcribe_audio" {
  bucket = aws_s3_bucket.transcribe_audio.id
  policy = data.aws_iam_policy_document.transcribe_audio.json
}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - Transcribe Audio
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "transcribe_audio" {
  statement {
    effect = "Deny"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:*",
    ]

    resources = [
      "${aws_s3_bucket.transcribe_audio.arn}",
      "${aws_s3_bucket.transcribe_audio.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }

  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::334678299258:role/GenerativeAiUseCasesStack-CustomS3AutoDeleteObjects-R51wY7tmChaz"]
    }

    actions = [
      "s3:DeleteObject*",
      "s3:GetBucket*",
      "s3:List*",
      "s3:PutBucketPolicy"
    ]

    resources = [
      "${aws_s3_bucket.transcribe_audio.arn}",
      "${aws_s3_bucket.transcribe_audio.arn}/*",
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Transcribe Transcript
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "transcribe_transcript" {
  bucket = local.bucket_name_transcribe_transcript
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket Policy - Transcribe Transcript
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "transcribe_transcript" {
  bucket = aws_s3_bucket.transcribe_transcript.id
  policy = data.aws_iam_policy_document.transcribe_transcript.json
}

# ----------------------------------------------------------------------------------------------
# IAM Policy Document - Transcribe Transcript
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "transcribe_transcript" {
  statement {
    effect = "Deny"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:*",
    ]

    resources = [
      "${aws_s3_bucket.transcribe_transcript.arn}",
      "${aws_s3_bucket.transcribe_transcript.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }

  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::334678299258:role/GenerativeAiUseCasesStack-CustomS3AutoDeleteObjects-R51wY7tmChaz"]
    }

    actions = [
      "s3:DeleteObject*",
      "s3:GetBucket*",
      "s3:List*",
      "s3:PutBucketPolicy"
    ]

    resources = [
      "${aws_s3_bucket.transcribe_transcript.arn}",
      "${aws_s3_bucket.transcribe_transcript.arn}/*",
    ]
  }
}
