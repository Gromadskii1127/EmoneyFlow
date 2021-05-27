output "frontend_bucket" {
  value = var.frontend_bucket
}

output "lambda_bucket" {
  value = var.lambda_bucket
}

output "frontend_website_s3_endpoint" {
  value = aws_s3_bucket.frontend.website_endpoint
}

output "frontend_website_cloudfront_distribution_domain" {
  value = aws_cloudfront_distribution.frontend_s3_distribution.domain_name
}
