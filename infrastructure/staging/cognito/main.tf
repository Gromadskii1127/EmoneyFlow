data "terraform_remote_state" "lambda" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-lambda"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

resource "aws_cognito_user_pool" "pm_user_pool" {
  name = var.cognito_user_pool_name
  
  mfa_configuration = "OPTIONAL"

  username_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }
 
  software_token_mfa_configuration {
    enabled = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    name = "apiKey"
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = true
    required = false
    string_attribute_constraints {
      min_length = 0
      max_length = 256
    }
  }

  schema {
    name = "userType"
    attribute_data_type = "Number"
    developer_only_attribute = false
    mutable = true
    required = false
    number_attribute_constraints {
      min_value = 0
      max_value = 1000
    }
  }
  
  schema {
    name = "companyId"
    attribute_data_type = "Number"
    developer_only_attribute = false
    mutable = true
    required = false
    number_attribute_constraints {
      min_value = 0
      max_value = 100000000
    } 
  }

  lambda_config {
    custom_message = data.terraform_remote_state.lambda.outputs.cognito_custom_message_arn
    post_confirmation = data.terraform_remote_state.lambda.outputs.cognito_post_confirmation_arn
  }
}

resource "aws_cognito_user_pool_client" "pm_frontend" {
  name = "pm-frontend"

  user_pool_id = aws_cognito_user_pool.pm_user_pool.id
}
