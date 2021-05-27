output "api_gateway_invoke_url" {
  value = aws_api_gateway_deployment.pm_api.invoke_url
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.pm_api.id
}

output "api_gateway_stage_name" {
  value = aws_api_gateway_stage.pm_api.stage_name
}

output "api_gateway_plan_id" {
  value = aws_api_gateway_usage_plan.pm_api.id
}
