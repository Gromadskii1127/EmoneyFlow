output "lambda_get_transaction_list_invoke_arn" {
  value = aws_lambda_function.get_transaction_list.invoke_arn
}

output "lambda_get_company_list_invoke_arn" {
  value = aws_lambda_function.get_company_list.invoke_arn
}

output "lambda_get_company_by_id_invoke_arn" {
  value = aws_lambda_function.get_company_by_id.invoke_arn
}

output "lambda_update_company_by_id_invoke_arn" {
  value = aws_lambda_function.update_company_by_id.invoke_arn
}

output "lambda_delete_company_by_id_invoke_arn" {
  value = aws_lambda_function.delete_company_by_id.invoke_arn
}
