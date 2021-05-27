provider "aws" {
  region = "eu-central-1"

  assume_role {
    role_arn = "arn:aws:iam::009046859339:role/Terraform"
  }
}
