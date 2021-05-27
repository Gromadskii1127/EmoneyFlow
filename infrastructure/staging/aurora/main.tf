data "terraform_remote_state" "secrets" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-secrets"
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

data "aws_region" "current" {}

resource "aws_db_subnet_group" "aurora" {
  subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2] 
}

resource "aws_rds_cluster" "cluster" {
  cluster_identifier     = var.db_cluster_name
  
  master_username        = var.db_master_username
  master_password        = var.db_master_password

  db_subnet_group_name = aws_db_subnet_group.aurora.name

  database_name  = var.db_name
  
  skip_final_snapshot    = true # Don't snapshot dev database

  engine = var.db_engine
  engine_version = var.db_engine_version
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  cluster_identifier = aws_rds_cluster.cluster.id
  
  identifier         = "${var.db_cluster_name}-instance"
  instance_class     = var.db_instance_class

  db_subnet_group_name = aws_db_subnet_group.aurora.name

  engine = var.db_engine
  engine_version = var.db_engine_version

  publicly_accessible = true
}

resource "aws_iam_role" "rds_lambda_proxy" {
  name = "${var.db_cluster_name}_lambda_proxy"

  assume_role_policy = templatefile("policies/rds-assume-role-policy.json", {})
}

resource "aws_iam_policy" "rds_lambda_proxy" {
  name = "${var.db_cluster_name}_secret_access"

  policy = templatefile("policies/secrets-access-policy.json", { PM_SECRET_KEY_ARN = data.terraform_remote_state.secrets.outputs.pm_secret_key_arn, DB_SECRET_ARN = data.terraform_remote_state.secrets.outputs.db_secret_arn, AWS_REGION = data.aws_region.current.name })
}

resource "aws_iam_policy_attachment" "rds_lambda_proxy" {
  name = "${var.db_cluster_name}_lambda_proxy_attachment"
  roles = [aws_iam_role.rds_lambda_proxy.name]
  policy_arn = aws_iam_policy.rds_lambda_proxy.arn
}

resource "aws_db_proxy" "lambda_proxy" {
  name = var.db_lambda_proxy_name
  debug_logging = true
  engine_family = "MYSQL"
  require_tls = true

  role_arn = aws_iam_role.rds_lambda_proxy.arn
  vpc_subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1,data.terraform_remote_state.network.outputs.lambda_subnet_id_2]

  auth {
    auth_scheme = "SECRETS"
    iam_auth = "REQUIRED"
    secret_arn = data.terraform_remote_state.secrets.outputs.db_secret_arn
  }
}

resource "aws_db_proxy_default_target_group" "lambda_proxy" {
  db_proxy_name = aws_db_proxy.lambda_proxy.name
}

resource "aws_db_proxy_target" "lambda_proxy" {
  db_cluster_identifier  = aws_rds_cluster.cluster.id
  db_proxy_name          = aws_db_proxy.lambda_proxy.name
  target_group_name      = aws_db_proxy_default_target_group.lambda_proxy.name
}
