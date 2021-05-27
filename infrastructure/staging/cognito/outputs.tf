output "cognito_user_pool_arn" {
  value = aws_cognito_user_pool.pm_user_pool.arn
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.pm_user_pool.id
}


output "cognito_client_id" {
  value = aws_cognito_user_pool_client.pm_frontend.id
}
