output "rds_proxy_endpoint" {
  value = aws_db_proxy.lambda_proxy.endpoint
}

output "rds_cluster_port" {
  value = aws_rds_cluster.cluster.port
}

output "rds_cluster_database_name" {
  value = aws_rds_cluster.cluster.database_name
}

output "rds_cluster_master_username" {
  value = aws_rds_cluster.cluster.master_username
}