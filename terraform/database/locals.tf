locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  suffix = random_id.this.hex

  # ----------------------------------------------------------------------------------------------
  # S3
  # ----------------------------------------------------------------------------------------------
  bucket_name_api_file              = "${var.prefix}-api-file-${local.suffix}"
  bucket_name_materials             = "${var.prefix}-materials-${local.suffix}"
  bucket_name_transcribe_audio      = "${var.prefix}-transcribe-audio-${local.suffix}"
  bucket_name_transcribe_transcript = "${var.prefix}-transcribe-transcript-${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# Bucket Random Id
# ----------------------------------------------------------------------------------------------
resource "random_id" "this" {
  byte_length = 3
}
