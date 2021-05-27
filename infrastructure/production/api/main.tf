resource "aws_iam_role" "pm_api" {
  name = "PM_Api"

  assume_role_policy = templatefile("policies/api-gateway-assume-role-policy.json", {})
}

resource "aws_iam_policy" "pm_api" {
  name = "PM_Api_Lambda_Access"

  policy = templatefile("policies/lambda-invoke-function-policy.json", {})
}

resource "aws_iam_policy_attachment" "pm_api" {
  name = "PM_Api_Lambda_Access_Attachment"
  roles = [aws_iam_role.pm_api.name]
  policy_arn = aws_iam_policy.pm_api.arn
}

resource "aws_api_gateway_rest_api" "pm_api" {
  name = "PM_Api"
  body = templatefile("./swagger.yaml", { executionCredentials = aws_iam_role.pm_api.arn, getTransactionListInvokeArn = var.getTransactionListInvokeArn, getCompanyListInvokeArn = var.getCompanyListInvokeArn, getCompanyByIdInvokeArn = var.getCompanyByIdInvokeArn, updateCompanyByIdInvokeArn = var.updateCompanyByIdInvokeArn, deleteCompanyByIdInvokeArn = var.deleteCompanyByIdInvokeArn })
}

resource "aws_api_gateway_deployment" "pm_api" {
  rest_api_id = aws_api_gateway_rest_api.pm_api.id
  stage_name = "test"
}

