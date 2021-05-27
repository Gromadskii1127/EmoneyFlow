provider "aws" {
  region = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::009046859339:role/Terraform"
  }
}
