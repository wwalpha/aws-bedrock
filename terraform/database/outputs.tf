output "bucket_file_arn" {
  value = aws_s3_bucket.file.arn
}

output "bucket_name_file" {
  value = aws_s3_bucket.file.bucket
}

output "bucket_name_material" {
  value = aws_s3_bucket.materials.bucket
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.this.name
}
