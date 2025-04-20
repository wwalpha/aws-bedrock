output "bucket_name_frontend" {
  value = aws_s3_bucket.frontend.bucket
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.this.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.this.id
}
