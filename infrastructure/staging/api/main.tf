data "terraform_remote_state" "lambda" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-lambda"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

data "terraform_remote_state" "cognito" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-cognito"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

data "terraform_remote_state" "route53" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-route53"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

resource "aws_iam_role" "pm_api" {
  name = var.api_name

  assume_role_policy = templatefile("policies/api-gateway-assume-role-policy.json", {})
}

resource "aws_iam_policy" "pm_api" {
  name = "${var.api_name}_lambda_access"

  policy = templatefile("policies/lambda-invoke-function-policy.json", {})
}

resource "aws_iam_policy_attachment" "pm_api" {
  name = "${var.api_name}_lambda_access_attachment"
  roles = [aws_iam_role.pm_api.name]
  policy_arn = aws_iam_policy.pm_api.arn
}

resource "aws_api_gateway_rest_api" "pm_api" {
  name = var.api_name
  body = templatefile("./swagger.yaml", {
    executionCredentials = aws_iam_role.pm_api.arn,
    cognitoUserPoolArn = data.terraform_remote_state.cognito.outputs.cognito_user_pool_arn,
    adminCreateCompanyInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminCreateCompany"].invoke_arn,
    adminCreateUserInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminCreateUser"].invoke_arn,
    adminDeleteCompanyInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminDeleteCompany"].invoke_arn,
    adminDeleteUserInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminDeleteUser"].invoke_arn,
    adminGetCompaniesInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminGetCompanies"].invoke_arn,
    adminGetCompanyByIdInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminGetCompanyById"].invoke_arn,
    adminGetTransactionsInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminGetTransactions"].invoke_arn,
    adminGetUsersInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminGetUsers"].invoke_arn,
    adminResetUserPasswordInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminResetUserPassword"].invoke_arn,
    adminUpdateCompanyInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminUpdateCompany"].invoke_arn
    adminUpdateUserInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["adminUpdateUser"].invoke_arn,
    mfaDisableInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["mfaDisable"].invoke_arn,
    mfaEnableInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["mfaEnable"].invoke_arn,
    mfaGetQrCodeInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["mfaGetQrCode"].invoke_arn,
    userCreatePayeeInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userCreatePayee"].invoke_arn,
    userCreatePayoutInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userCreatePayout"].invoke_arn,
    userDeletePayeeInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userDeletePayee"].invoke_arn,
    userGetDashboardBalanceInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetDashboardBalance"].invoke_arn,
    userGetDashboardDebitsInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetDashboardDebits"].invoke_arn,
    userGetDashboardFeesInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetDashboardFees"].invoke_arn,
    userGetDashboardKipsInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetDashboardKips"].invoke_arn,
    userGetDashboardPayeesInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetDashboardPayees"].invoke_arn,
    userGetPayeeByIdInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetPayeeById"].invoke_arn,
    userGetPayeesInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetPayees"].invoke_arn,
    userGetTransactionsInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetTransactions"].invoke_arn,
    userGetUserInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userGetUser"].invoke_arn,
    userUpdatePayeeInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userUpdatePayee"].invoke_arn,
    userUpdateUserInvokeArn = data.terraform_remote_state.lambda.outputs.api_functions["userUpdateUser"].invoke_arn
  })
}

resource "aws_api_gateway_deployment" "pm_api" {
  rest_api_id = aws_api_gateway_rest_api.pm_api.id

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.pm_api.body))
  }
}

resource "aws_api_gateway_stage" "pm_api" {
  stage_name = var.environment
  deployment_id = aws_api_gateway_deployment.pm_api.id
  rest_api_id   = aws_api_gateway_rest_api.pm_api.id

  depends_on = ["aws_api_gateway_deployment.pm_api"]
}

resource "aws_api_gateway_domain_name" "pm_api" {
  certificate_arn = data.terraform_remote_state.route53.outputs.api_cert_arn
  domain_name     = data.terraform_remote_state.route53.outputs.api_domain
}

resource "aws_route53_record" "pm_api" {
  zone_id = data.terraform_remote_state.route53.outputs.api_zone_id
  name = data.terraform_remote_state.route53.outputs.api_domain
  type = "A"

  alias {
    name = aws_api_gateway_domain_name.pm_api.cloudfront_domain_name
    zone_id = aws_api_gateway_domain_name.pm_api.cloudfront_zone_id
    evaluate_target_health = false
  }
}

resource "aws_api_gateway_base_path_mapping" "pm_api" {
  api_id      = aws_api_gateway_rest_api.pm_api.id
  stage_name  = aws_api_gateway_stage.pm_api.stage_name
  domain_name = aws_api_gateway_domain_name.pm_api.domain_name

  depends_on = ["aws_api_gateway_stage.pm_api"]
}

resource "aws_api_gateway_usage_plan" "pm_api" {
  name         = "${var.api_name}_usage_plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.pm_api.id
    stage  = aws_api_gateway_stage.pm_api.stage_name
  }
}
