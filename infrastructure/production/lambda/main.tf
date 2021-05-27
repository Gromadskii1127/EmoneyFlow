resource "aws_lambda_function" "get_transaction_list" {
  function_name = "getTransactionList"

  s3_bucket = "pm-api-bucket-prod"
  s3_key = "getTransactionList.zip"

  handler = "main.handler"
  runtime = "nodejs10.x"

  role = aws_iam_role.get_transaction_list.arn
}

resource "aws_iam_role" "get_transaction_list" {
  name = "Lambda_Get_Transaction_List"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_lambda_function" "get_company_list" {
  function_name = "getCompanyList"

  s3_bucket = "pm-api-bucket-prod"
  s3_key = "getCompanyList.zip"

  handler = "main.handler"
  runtime = "nodejs10.x"

  role = aws_iam_role.get_company_list.arn
}

resource "aws_iam_role" "get_company_list" {
  name = "Lambda_Get_Company_List"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_lambda_function" "get_company_by_id" {
  function_name = "getCompanyById"

  s3_bucket = "pm-api-bucket-prod"
  s3_key = "getCompanyById.zip"

  handler = "main.handler"
  runtime = "nodejs10.x"

  role = aws_iam_role.get_company_by_id.arn
}

resource "aws_iam_role" "get_company_by_id" {
  name = "Lambda_Get_Company_By_Id"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_lambda_function" "delete_company_by_id" {
  function_name = "deleteCompanyById"

  s3_bucket = "pm-api-bucket-prod"
  s3_key = "deleteCompanyById.zip"

  handler = "main.handler"
  runtime = "nodejs10.x"

  role = aws_iam_role.delete_company_by_id.arn
}

resource "aws_iam_role" "delete_company_by_id" {
  name = "Lambda_Delete_Company_By_Id"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}

resource "aws_lambda_function" "update_company_by_id" {
  function_name = "updateCompanyById"

  s3_bucket = "pm-api-bucket-prod"
  s3_key = "updateCompanyById.zip"

  handler = "main.handler"
  runtime = "nodejs10.x"

  role = aws_iam_role.update_company_by_id.arn
}

resource "aws_iam_role" "update_company_by_id" {
  name = "Lambda_Update_Company_By_Id"

  assume_role_policy = templatefile("policies/lambda-assume-role-policy.json", {})
}
