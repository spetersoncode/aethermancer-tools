resource "google_artifact_registry_repository" "docker" {
  location      = var.location
  repository_id = var.repository_id
  description   = "Docker repository for ${var.app_name}"
  format        = "DOCKER"

  labels = var.labels
}
