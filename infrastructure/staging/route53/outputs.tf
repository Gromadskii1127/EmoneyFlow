output "frontend_domain" {
  value = aws_acm_certificate.frontend_cert.domain_name
}

output "frontend_zone_id" {
  value = aws_route53_zone.pm_zone.zone_id
}

output "frontend_cert_arn" {
  value = aws_acm_certificate.frontend_cert.arn
}

output "api_domain" {
  value = aws_acm_certificate.api_cert.domain_name
}

output "api_zone_id" {
  value = aws_route53_zone.pm_zone.zone_id
}

output "api_cert_arn" {
  value = aws_acm_certificate.api_cert.arn
}
