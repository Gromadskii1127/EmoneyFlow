data "terraform_remote_state" "lambda" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-lambda"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

resource "aws_cloudwatch_event_rule" "user_reconcilation_utc_5" {
  name                = "userReconcilation_UTC-5"
  schedule_expression = "cron(0 5 * * ? *)"
}

resource "aws_cloudwatch_event_rule" "user_reconcilation_utc_9" {
  name                = "userReconcilation_UTC-9"
  schedule_expression = "cron(0 9 * * ? *)"
}

resource "aws_cloudwatch_event_rule" "user_reconcilation_utc_13" {
  name                = "userReconcilation_UTC-13"
  schedule_expression = "cron(0 13 * * ? *)"
}

resource "aws_cloudwatch_event_rule" "user_reconcilation_utc_17" {
  name                = "userReconcilation_UTC-17"
  schedule_expression = "cron(0 17 * * ? *)"
}

resource "aws_cloudwatch_event_rule" "user_schedule_payout_utc_5" {
  name                = "userSchedulePayout_UTC-5"
  schedule_expression = "cron(0 5 * * ? *)"
}

resource "aws_cloudwatch_event_target" "user_reconcilation_5" {
  rule      = aws_cloudwatch_event_rule.user_reconcilation_utc_5.name
  target_id = "lambda"
  arn       = data.terraform_remote_state.lambda.outputs.user_reconcilation_arn
}

resource "aws_cloudwatch_event_target" "user_reconcilation_9" {
  rule      = aws_cloudwatch_event_rule.user_reconcilation_utc_9.name
  target_id = "lambda"
  arn       = data.terraform_remote_state.lambda.outputs.user_reconcilation_arn
}

resource "aws_cloudwatch_event_target" "user_reconcilation_13" {
  rule      = aws_cloudwatch_event_rule.user_reconcilation_utc_13.name
  target_id = "lambda"
  arn       = data.terraform_remote_state.lambda.outputs.user_reconcilation_arn
}

resource "aws_cloudwatch_event_target" "user_reconcilation_17" {
  rule      = aws_cloudwatch_event_rule.user_reconcilation_utc_17.name
  target_id = "lambda"
  arn       = data.terraform_remote_state.lambda.outputs.user_reconcilation_arn
}

resource "aws_cloudwatch_event_target" "user_schedule_payout_5" {
  rule      = aws_cloudwatch_event_rule.user_reconcilation_utc_5.name
  target_id = "lambda"
  arn       = data.terraform_remote_state.lambda.outputs.user_schedule_payout_arn
}

resource "aws_lambda_permission" "user_reconcilation_utc_5" {
  action        = "lambda:InvokeFunction"
  function_name = "userReconcilation"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.user_reconcilation_utc_5.arn
}

resource "aws_lambda_permission" "user_reconcilation_utc_9" {
  action        = "lambda:InvokeFunction"
  function_name = "userReconcilation"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.user_reconcilation_utc_9.arn
}

resource "aws_lambda_permission" "user_reconcilation_utc_13" {
  action        = "lambda:InvokeFunction"
  function_name = "userReconcilation"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.user_reconcilation_utc_13.arn
}

resource "aws_lambda_permission" "user_reconcilation_utc_17" {
  action        = "lambda:InvokeFunction"
  function_name = "userReconcilation"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.user_reconcilation_utc_17.arn
}

resource "aws_lambda_permission" "user_schedule_payout_utc_5" {
  action        = "lambda:InvokeFunction"
  function_name = "userSchedulePayout"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.user_schedule_payout_utc_5.arn
}
