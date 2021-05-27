output "db_secret_arn" {
  value = aws_secretsmanager_secret.db_secret.arn
}

output "pm_secret_key_arn" {
  value = aws_kms_key.pm_secret_key.arn
}
