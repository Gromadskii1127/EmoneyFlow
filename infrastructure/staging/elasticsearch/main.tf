data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

data "terraform_remote_state" "network" {
  backend = "http"

  config = {
    address = "${var.remote_state_base_path}/${var.environment}-network"
    username = var.remote_state_username
    password = var.remote_state_access_token
  }
}

resource "aws_iam_service_linked_role" "es" {
  aws_service_name = "es.amazonaws.com"
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = var.es_domain
  elasticsearch_version = var.es_version

  cluster_config {
    instance_type = var.es_instance_type
    instance_count = var.es_instance_count
  }

  vpc_options {
    subnet_ids = [data.terraform_remote_state.network.outputs.lambda_subnet_id_1]
    security_group_ids = [data.terraform_remote_state.network.outputs.es_security_group_id]
  }

  ebs_options {
    ebs_enabled = var.es_ebs_enabled
    volume_size = var.es_volume_size
  }

  encrypt_at_rest {
    enabled = var.es_encrypt_at_rest
  }

  access_policies = templatefile("policies/elasticsearch-access-policy.json", { AWS_REGION = data.aws_region.current.name, AWS_ACCOUNT_ID = data.aws_caller_identity.current.account_id, ES_DOMAIN = var.es_domain })
  
  depends_on = [aws_iam_service_linked_role.es]
}
