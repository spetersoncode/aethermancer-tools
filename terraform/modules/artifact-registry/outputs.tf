output "repository_id" {
  description = "The repository ID"
  value       = google_artifact_registry_repository.docker.repository_id
}

output "repository_url" {
  description = "The full repository URL"
  value       = "${var.location}-docker.pkg.dev/${google_artifact_registry_repository.docker.project}/${google_artifact_registry_repository.docker.repository_id}"
}

output "location" {
  description = "The repository location"
  value       = google_artifact_registry_repository.docker.location
}
