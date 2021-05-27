## Frontend

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

# This is required to update frontend code via CI/CD
resource "aws_iam_role" "frontend" {
  name = "S3_Frontend"

  assume_role_policy = templatefile("policies/s3-assume-role-policy.json", {})
}

resource "aws_iam_policy" "frontend" {
  name = "S3_Frontend_Push_Access"

  policy = templatefile("policies/s3-push-policy.json", { BUCKET = aws_s3_bucket.frontend.bucket })
}

resource "aws_iam_policy_attachment" "frontend" {
  name = "S3_Frontend_Push_Access_Attachment"
  roles = [aws_iam_role.frontend.name]
  policy_arn = aws_iam_policy.frontend.arn
}

# CloudFront distribution

locals {
  s3_origin_id = "FrontendS3Origin"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
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

  #aliases = ["mysite.example.com", "yoursite.example.com"]

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
    cloudfront_default_certificate = true
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

resource "aws_s3_bucket" "pm_api" {
  bucket = "pm-api-bucket-prod"
  acl = "private"

  versioning {
    enabled = true
  }
}

# This is required to update lambda code via CI/CD
resource "aws_iam_role" "pm_api" {
  name = "S3_Lambda_PM_Api"

  assume_role_policy = templatefile("policies/s3-assume-role-policy.json", {})
}

resource "aws_iam_policy" "pm_api" {
  name = "S3_Lambda_PM_Api_Push_Access"

  policy = templatefile("policies/s3-push-policy.json", { BUCKET = aws_s3_bucket.pm_api.bucket })
}

resource "aws_iam_policy_attachment" "pm_api" {
  name = "S3_Lambda_Example_Push_Access_Attachment"
  roles = [aws_iam_role.pm_api.name]
  policy_arn = aws_iam_policy.pm_api.arn
}
