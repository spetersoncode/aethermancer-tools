# Artifact Registry Outputs
output "artifact_registry_repository_url" {
  description = "The Artifact Registry repository URL"
  value       = module.artifact_registry.repository_url
}

output "artifact_registry_location" {
  description = "The Artifact Registry location"
  value       = module.artifact_registry.location
}

# Cloud Run Outputs
output "cloud_run_service_url" {
  description = "The URL of the deployed Cloud Run service"
  value       = module.cloud_run.service_url
}

output "cloud_run_service_name" {
  description = "The name of the Cloud Run service"
  value       = module.cloud_run.service_name
}

output "cloud_run_service_account_email" {
  description = "The service account email used by Cloud Run"
  value       = module.cloud_run.service_account_email
}

output "cloud_build_service_account_email" {
  description = "The service account email used by Cloud Build (use this in your build trigger)"
  value       = google_service_account.cloud_build.email
}

# Deployment Instructions
output "deployment_instructions" {
  description = "Next steps for deploying your application"
  value = <<-EOT

    ✅ Infrastructure created successfully!

    Next steps:

    1. Build and push your Docker image:
       cd web
       gcloud builds submit --tag ${module.artifact_registry.repository_url}/${var.app_name}:${var.docker_image_tag}

    2. Deploy to Cloud Run (if using Cloud Build manually):
       gcloud run deploy ${module.cloud_run.service_name} \
         --image ${module.artifact_registry.repository_url}/${var.app_name}:${var.docker_image_tag} \
         --region ${var.cloud_run_location}

    3. Access your application:
       ${module.cloud_run.service_url}

    For automated deployments, see TERRAFORM.md for Cloud Build configuration.
  EOT
}

# Project Information
output "project_id" {
  description = "The GCP project ID"
  value       = var.project_id
}

output "region" {
  description = "The primary GCP region"
  value       = var.region
}
