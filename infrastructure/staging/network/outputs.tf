output "lambda_subnet_id_1" {
  value = aws_subnet.lambda_1.id
}

output "lambda_subnet_id_2" {
  value = aws_subnet.lambda_2.id
}

output "lambda_subnet_id_1_public" {
  value = aws_subnet.lambda_1_public.id
}

output "lambda_subnet_id_2_public" {
  value = aws_subnet.lambda_2_public.id
}

output "lambda_security_group_id" {
  value = aws_vpc.main.default_security_group_id
}

output "es_security_group_id" {
  value = aws_vpc.main.default_security_group_id
}
