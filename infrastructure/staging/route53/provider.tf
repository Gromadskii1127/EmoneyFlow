# Note Cloudfront and Api gateway require certificates to be in us-east-1
provider "aws" {
  region = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::009046859339:role/Terraform"
  }
}
