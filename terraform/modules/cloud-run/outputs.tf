output "service_name" {
  description = "Cloud Run service name"
  value       = google_cloud_run_v2_service.app.name
}

output "service_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.app.uri
}

output "service_account_email" {
  description = "Service account email"
  value       = var.service_account_email
}

output "service_account_id" {
  description = "Service account ID (full resource name)"
  value       = "projects/${var.project_id}/serviceAccounts/${var.service_account_email}"
}

output "service_id" {
  description = "Cloud Run service ID"
  value       = google_cloud_run_v2_service.app.id
}

output "custom_domain_status" {
  description = "Custom domain mapping status"
  value       = var.custom_domain != "" ? google_cloud_run_domain_mapping.custom_domain[0].status : null
}
