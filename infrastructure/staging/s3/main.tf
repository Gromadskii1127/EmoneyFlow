## Frontend
data "terraform_remote_state" "route53" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-route53"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

# Create origin access identity, to allow CloudFront to access private S3 bucket
resource "aws_cloudfront_origin_access_identity" "frontend" {}

resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket
  acl = "private"

  #policy = templatefile("policies/s3-public-access-policy.json", { BUCKET = var.frontend_bucket })
  policy = templatefile("policies/s3-cloudfront-access-policy.json", { BUCKET = var.frontend_bucket, ORIGIN_ACCESS_IDENTITY_ARN = aws_cloudfront_origin_access_identity.frontend.iam_arn })

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# This role is used to push code from CI/CD
resource "aws_iam_role" "frontend" {
  name = var.frontend_bucket

  assume_role_policy = templatefile("policies/s3-assume-role-policy.json", {})
}

resource "aws_iam_policy" "frontend" {
  name = "${var.frontend_bucket}_push_access"

  policy = templatefile("policies/s3-push-policy.json", { BUCKET = var.frontend_bucket })
}

resource "aws_iam_policy_attachment" "frontend" {
  name = "${var.frontend_bucket}_push_access_attachment"
  roles = [aws_iam_role.frontend.name]
  policy_arn = aws_iam_policy.frontend.arn
}

# CloudFront distribution

locals {
  s3_origin_id = "FrontendS3Origin"
}

resource "aws_cloudfront_distribution" "frontend_s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [ data.terraform_remote_state.route53.outputs.frontend_domain ]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.terraform_remote_state.route53.outputs.frontend_cert_arn
    ssl_support_method = "sni-only"
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code = 403
    response_code = 200
    response_page_path = "/index.html"
  }
}

## Lambda

resource "aws_s3_bucket" "lambda" {
  bucket = var.lambda_bucket
  acl = "private"

  versioning {
    enabled = true
  }
}

# This is required to update lambda code via CI/CD
resource "aws_iam_role" "lambda" {
  name = var.lambda_bucket

  assume_role_policy = templatefile("policies/s3-assume-role-policy.json", {})
}

resource "aws_iam_policy" "lambda" {
  name = "${var.lambda_bucket}_push_access"

  policy = templatefile("policies/s3-push-policy.json", { BUCKET = var.lambda_bucket })
}

resource "aws_iam_policy_attachment" "lambda" {
  name = "${var.lambda_bucket}_push_access_attachment"
  roles = [aws_iam_role.lambda.name]
  policy_arn = aws_iam_policy.lambda.arn
}

resource "aws_route53_record" "frontend" {
  zone_id = data.terraform_remote_state.route53.outputs.frontend_zone_id
  name = data.terraform_remote_state.route53.outputs.frontend_domain
  type = "A"

  alias {
    name = aws_cloudfront_distribution.frontend_s3_distribution.domain_name
    zone_id = aws_cloudfront_distribution.frontend_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
