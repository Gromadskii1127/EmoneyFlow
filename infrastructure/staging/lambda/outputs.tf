# Cognito

output "cognito_custom_message_arn" {
  value = aws_lambda_function.cognito_custom_message.arn
}

output "cognito_post_confirmation_arn" {
  value = aws_lambda_function.cognito_post_confirmation.arn
}

# CronJobs

output "user_reconcilation_arn" {
  value = aws_lambda_function.user_reconcilation.arn
}

output "user_schedule_payout_arn" {
  value = aws_lambda_function.user_schedule_payout.arn
}

# Api Gateway

output "api_functions" {
  value = tomap(aws_lambda_function.api)
}
