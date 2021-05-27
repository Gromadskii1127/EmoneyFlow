variable "environment" { type = string }
variable "remote_state_base_path" { type = string }
variable "remote_state_username" { type = string }
variable "remote_state_access_token" { type = string }

variable "db_master_password" {
  type = string
  sensitive = true
}

variable "db_name" {
  type = string
  default = "payoutmanager"
}

variable "db_cluster_name" {
  type = string
  default = "pm-aurora"
}

variable "db_master_username" {
  type = string
  default = "admin"
}

variable "db_instance_class" {
  type = string
  default = "db.t3.small"
}

variable "db_engine" {
  type = string
  default = "aurora-mysql"
}

variable "db_engine_version" {
  type = string
  default = "5.7.mysql_aurora.2.07.2"
}

variable "db_lambda_proxy_name" {
  type = string
  default = "pm-lambda-proxy"
}
