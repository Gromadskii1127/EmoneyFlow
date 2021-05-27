variable "environment" { type = string }
variable "remote_state_base_path" { type = string }
variable "remote_state_username" { type = string }
variable "remote_state_access_token" { type = string }

variable "es_domain" {
  type = string
  default = "pm-es-domain"
}

variable "es_instance_type" {
  type = string
  default = "t3.small.elasticsearch"
}

variable "es_instance_count" {
  type = number
  default = 1
}

variable "es_version" {
  type = string
  default = "7.9"
}

variable "es_encrypt_at_rest" {
  type = bool
  default = false
}

variable "es_ebs_enabled" {
  type = bool
  default = true
}

variable "es_volume_size" {
  type = number
  default = 10
}
