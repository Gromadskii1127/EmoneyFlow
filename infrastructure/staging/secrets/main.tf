resource "aws_kms_key" "pm_secret_key" {}

resource "aws_secretsmanager_secret" "db_secret" {
  name = var.db_secret_name
  kms_key_id = aws_kms_key.pm_secret_key.arn
}
