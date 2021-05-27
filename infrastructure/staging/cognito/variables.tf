variable "environment" { type = string }
variable "remote_state_base_path" { type = string }
variable "remote_state_username" { type = string }
variable "remote_state_access_token" { type = string }

variable "cognito_user_pool_name" {
  type = string
  default = "pm-user-pool"
}
