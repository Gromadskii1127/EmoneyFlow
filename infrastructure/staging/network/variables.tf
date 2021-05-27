variable "vpc_cidr_block" {
  type = string
  default = "10.0.0.0/16"
}

variable "lambda_1_subnet_cidr_block" {
  type = string
  default = "10.0.1.0/24"
}

variable "lambda_2_subnet_cidr_block" {
  type = string
  default = "10.0.2.0/24"
}

variable "lambda_1_public_subnet_cidr_block" {
  type = string
  default = "10.0.3.0/24"
}

variable "lambda_2_public_subnet_cidr_block" {
  type = string
  default = "10.0.4.0/24"
}

variable "aws_region" {
  type = string
  default = "eu-central-1"
}
