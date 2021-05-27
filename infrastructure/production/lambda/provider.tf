provider "aws" {
  region = "eu-central-1"

  assume_role {
    role_arn = "arn:aws:iam::970825508194:role/Terraform"
  }
}
