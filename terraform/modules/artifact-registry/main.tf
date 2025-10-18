resource "google_artifact_registry_repository" "docker" {
  location      = var.location
  repository_id = var.repository_id
  description   = "Docker repository for ${var.app_name}"
  format        = "DOCKER"

  labels = var.labels

  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"

    most_recent_versions {
      keep_count = var.cleanup_keep_count
    }
  }

  cleanup_policies {
    id     = "delete-old-versions"
    action = "DELETE"

    condition {
      older_than = "${var.cleanup_retention_days}d"
    }
  }
}
