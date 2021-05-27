data "terraform_remote_state" "s3" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-s3"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

data "terraform_remote_state" "network" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-network"
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

data "terraform_remote_state" "aurora" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-aurora"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

data "terraform_remote_state" "elasticsearch" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-elasticsearch"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

data "terraform_remote_state" "api" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-api"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

# Note: Currently all lambdas use the same role, previously I've had one role per lambda, but I assume that we don't need any special configuration here. We should use groups if different roles are required.
resource "aws_iam_role" "lambda" {
  name = "Lambda"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
    role       = aws_iam_role.lambda.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role" "lambda_admin" {
  name = "LambdaAdmin"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_iam_role_policy_attachment" "lambda_admin_vpc_access" {
    role       = aws_iam_role.lambda_admin.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_admin_cognito" {
    role       = aws_iam_role.lambda_admin.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
}

resource "aws_iam_role_policy_attachment" "lambda_admin_es" {
    role       = aws_iam_role.lambda_admin.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonESFullAccess"
}

resource "aws_iam_policy" "rds_db_connect" {
  name = "RdsDbConnect"
  policy = templatefile("policies/rds-connect-policy.json", {})
}

resource "aws_iam_role_policy_attachment" "lambda_admin_rds" {
    role       = aws_iam_role.lambda_admin.name
    policy_arn = aws_iam_policy.rds_db_connect.arn
}

resource "aws_iam_role" "lambda_cognito" {
  name = "LambdaCognito"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_iam_role_policy_attachment" "lambda_cognito_vpc_access" {
    role       = aws_iam_role.lambda_cognito.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_cognito_api" {
    role       = aws_iam_role.lambda_cognito.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator"
}

resource "aws_iam_role_policy_attachment" "lambda_cognito_cognito" {
    role       = aws_iam_role.lambda_cognito.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
}

### Layers

data "aws_s3_bucket_object" "commonLayer" {
  bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  key = "commonLayer.zip"
}


resource "aws_lambda_layer_version" "commonLayer" {
  layer_name = "commonLayer"

  s3_bucket = data.aws_s3_bucket_object.commonLayer.bucket
  s3_key = data.aws_s3_bucket_object.commonLayer.key
  s3_object_version = data.aws_s3_bucket_object.commonLayer.version_id

  compatible_runtimes = ["nodejs14.x"]
}

### Lambdas

#### Extra

# This function is not mapped to API gateway, so no output is specified
resource "aws_lambda_function" "create_super_user" {
  function_name = "createSuperUser"
  
  s3_bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  s3_key = "createSuperUser.zip"
  
  handler = "index.handler"
  runtime = "nodejs14.x"

  vpc_config {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]
    security_group_ids = [data.terraform_remote_state.network.outputs.lambda_security_group_id]
  }

  role = aws_iam_role.lambda_admin.arn

  layers = [aws_lambda_layer_version.commonLayer.arn]

  environment {
    variables = {
      DB_URL = data.terraform_remote_state.aurora.outputs.rds_proxy_endpoint
      DB_USERNAME = data.terraform_remote_state.aurora.outputs.rds_cluster_master_username
      DB_DATABASE =  data.terraform_remote_state.aurora.outputs.rds_cluster_database_name
      DB_PORT = data.terraform_remote_state.aurora.outputs.rds_cluster_port
      COGNITO_USER_POOL_ID = data.terraform_remote_state.cognito.outputs.cognito_user_pool_id
      COGNITO_CLIENT_ID = data.terraform_remote_state.cognito.outputs.cognito_client_id
      ES_DOMAIN = data.terraform_remote_state.elasticsearch.outputs.elastic_search_domain_endpoint
      API_GATEWAY_REST_API_ID = try(data.terraform_remote_state.api.outputs.api_gateway_id, "known_after_deploying_api_gateway")
      API_GATEWAY_STAGE_NAME = try(data.terraform_remote_state.api.outputs.api_gateway_stage_name, "known_after_deploying_api_gateway")
      API_GATEWAY_PLAN_ID = try(data.terraform_remote_state.api.outputs.api_gateway_plan_id, "known_after_deploying_api_gateway")
      SUPERUSER_NAME = ""
      SUPERUSER_PASSWORD = ""
    }
  }

  timeout = 10
}

#### Cognito

resource "aws_lambda_function" "cognito_custom_message" {
  function_name = "cognitoCustomMessage"
  
  s3_bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  s3_key = "cognitoCustomMessage.zip"
  
  handler = "index.handler"
  runtime = "nodejs14.x"

  vpc_config {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]
    security_group_ids = [data.terraform_remote_state.network.outputs.lambda_security_group_id]
  }
  
  role = aws_iam_role.lambda_cognito.arn

  layers = [aws_lambda_layer_version.commonLayer.arn]

  environment {
    variables = {
      DB_URL = data.terraform_remote_state.aurora.outputs.rds_proxy_endpoint
      DB_USERNAME = data.terraform_remote_state.aurora.outputs.rds_cluster_master_username
      DB_DATABASE =  data.terraform_remote_state.aurora.outputs.rds_cluster_database_name
      DB_PORT = data.terraform_remote_state.aurora.outputs.rds_cluster_port
      COGNITO_USER_POOL_ID = try(data.terraform_remote_state.cognito.outputs.cognito_user_pool_id, "known_after_deploying_cognito")
      COGNITO_CLIENT_ID = try(data.terraform_remote_state.cognito.outputs.cognito_client_id, "known_after_deploying_cognito")
      ES_DOMAIN = data.terraform_remote_state.elasticsearch.outputs.elastic_search_domain_endpoint
      API_GATEWAY_REST_API_ID = try(data.terraform_remote_state.api.outputs.api_gateway_id, "known_after_deploying_api_gateway")
      API_GATEWAY_STAGE_NAME = try(data.terraform_remote_state.api.outputs.api_gateway_stage_name, "known_after_deploying_api_gateway")
      API_GATEWAY_PLAN_ID = try(data.terraform_remote_state.api.outputs.api_gateway_plan_id, "known_after_deploying_api_gateway")
    }
  }

  timeout = 10
}

resource "aws_lambda_permission" "cognito_custom_message" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_custom_message.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = data.terraform_remote_state.cognito.outputs.cognito_user_pool_arn
}

resource "aws_lambda_function" "cognito_post_confirmation" {
  function_name = "cognitoPostConfirmation"
  
  s3_bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  s3_key = "cognitoPostConfirmation.zip"
  
  handler = "index.handler"
  runtime = "nodejs14.x"

  vpc_config {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]
    security_group_ids = [data.terraform_remote_state.network.outputs.lambda_security_group_id]
  }
  
  role = aws_iam_role.lambda_cognito.arn

  layers = [aws_lambda_layer_version.commonLayer.arn]

  environment {
    variables = {
      DB_URL = data.terraform_remote_state.aurora.outputs.rds_proxy_endpoint
      DB_USERNAME = data.terraform_remote_state.aurora.outputs.rds_cluster_master_username
      DB_DATABASE =  data.terraform_remote_state.aurora.outputs.rds_cluster_database_name
      DB_PORT = data.terraform_remote_state.aurora.outputs.rds_cluster_port
      COGNITO_USER_POOL_ID = try(data.terraform_remote_state.cognito.outputs.cognito_user_pool_id, "known_after_deploying_cognito")
      COGNITO_CLIENT_ID = try(data.terraform_remote_state.cognito.outputs.cognito_client_id, "known_after_deploying_cognito")
      ES_DOMAIN = data.terraform_remote_state.elasticsearch.outputs.elastic_search_domain_endpoint
      API_GATEWAY_REST_API_ID = try(data.terraform_remote_state.api.outputs.api_gateway_id, "known_after_deploying_api_gateway")
      API_GATEWAY_STAGE_NAME = try(data.terraform_remote_state.api.outputs.api_gateway_stage_name, "known_after_deploying_api_gateway")
      API_GATEWAY_PLAN_ID = try(data.terraform_remote_state.api.outputs.api_gateway_plan_id, "known_after_deploying_api_gateway")
    }
  }

  timeout = 10
}

resource "aws_lambda_permission" "cognito_post_confirmation" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = data.terraform_remote_state.cognito.outputs.cognito_user_pool_arn
}

#### CronJobs

resource "aws_lambda_function" "user_reconcilation" {
  function_name = "userReconcilation"
  
  s3_bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  s3_key = "userReconcilation.zip"
  
  handler = "index.handler"
  runtime = "nodejs14.x"

  vpc_config {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]
    security_group_ids = [data.terraform_remote_state.network.outputs.lambda_security_group_id]
  }
  
  role = aws_iam_role.lambda.arn

  layers = [aws_lambda_layer_version.commonLayer.arn]

  timeout = 10
}


resource "aws_lambda_function" "user_schedule_payout" {
  function_name = "userSchedulePayout"
  
  s3_bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  s3_key = "userSchedulePayout.zip"
  
  handler = "index.handler"
  runtime = "nodejs14.x"

  vpc_config {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]
    security_group_ids = [data.terraform_remote_state.network.outputs.lambda_security_group_id]
  }
  
  role = aws_iam_role.lambda.arn

  layers = [aws_lambda_layer_version.commonLayer.arn]

  timeout = 10
}

#### API Gateway

locals {   
  api_gateway_functions = toset([
    "adminCreateCompany",
    "adminCreateUser",
    "adminDeleteCompany",
    "adminDeleteUser",
    "adminGetCompanies",
    "adminGetCompanyById",
    "adminGetTransactions",
    "adminGetUsers",
    "adminResetUserPassword",
    "adminUpdateCompany",
    "adminUpdateUser",
    "mfaDisable",
    "mfaEnable",
    "mfaGetQrCode",
    "userCreatePayee",
    "userCreatePayout",
    "userDeletePayee",
    "userGetDashboardBalance",
    "userGetDashboardDebits",
    "userGetDashboardFees",
    "userGetDashboardKips",
    "userGetDashboardPayees",
    "userGetPayeeById",
    "userGetPayees",
    "userGetTransactions",
    "userGetUser",
    "userUpdatePayee",
    "userUpdateUser"
  ])
}

resource "aws_lambda_function" "api" {
  for_each = local.api_gateway_functions

  function_name = each.key
  
  s3_bucket = data.terraform_remote_state.s3.outputs.lambda_bucket
  s3_key = "${each.key}.zip"
  
  handler = "index.handler"
  runtime = "nodejs14.x"

  vpc_config {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]
    security_group_ids = [data.terraform_remote_state.network.outputs.lambda_security_group_id]
  }

  role = aws_iam_role.lambda_admin.arn

  layers = [aws_lambda_layer_version.commonLayer.arn]

  environment {
    variables = {
      DB_URL = data.terraform_remote_state.aurora.outputs.rds_proxy_endpoint
      DB_USERNAME = data.terraform_remote_state.aurora.outputs.rds_cluster_master_username
      DB_DATABASE =  data.terraform_remote_state.aurora.outputs.rds_cluster_database_name
      DB_PORT = data.terraform_remote_state.aurora.outputs.rds_cluster_port
      COGNITO_USER_POOL_ID = try(data.terraform_remote_state.cognito.outputs.cognito_user_pool_id, "known_after_deploying_cognito")
      COGNITO_CLIENT_ID = try(data.terraform_remote_state.cognito.outputs.cognito_client_id, "known_after_deploying_cognito")
      ES_DOMAIN = data.terraform_remote_state.elasticsearch.outputs.elastic_search_domain_endpoint
      API_GATEWAY_REST_API_ID = try(data.terraform_remote_state.api.outputs.api_gateway_id, "known_after_deploying_api_gateway")
      API_GATEWAY_STAGE_NAME = try(data.terraform_remote_state.api.outputs.api_gateway_stage_name, "known_after_deploying_api_gateway")
      API_GATEWAY_PLAN_ID = try(data.terraform_remote_state.api.outputs.api_gateway_plan_id, "known_after_deploying_api_gateway")
    }
  }

  timeout = 10
}
