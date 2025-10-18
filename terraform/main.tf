# Local variables
locals {
  labels = {
    app         = var.app_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry Module
module "artifact_registry" {
  source = "./modules/artifact-registry"

  location               = var.artifact_registry_location
  repository_id          = "${var.app_name}-docker"
  app_name               = var.app_name
  labels                 = local.labels
  cleanup_retention_days = var.artifact_cleanup_retention_days
  cleanup_keep_count     = var.artifact_cleanup_keep_count

  depends_on = [google_project_service.required_apis]
}

# Service Account for Cloud Run (runtime)
resource "google_service_account" "cloud_run" {
  account_id   = "${var.app_name}-cloud-run"
  display_name = "Cloud Run Service Account for ${var.app_name}"
  description  = "Service account used by Cloud Run service"

  depends_on = [google_project_service.required_apis]
}

# Service Account for Cloud Build (CI/CD)
resource "google_service_account" "cloud_build" {
  account_id   = "${var.app_name}-cloud-build"
  display_name = "Cloud Build Service Account for ${var.app_name}"
  description  = "Service account used by Cloud Build for CI/CD pipeline"

  depends_on = [google_project_service.required_apis]
}

# Cloud Run Module
module "cloud_run" {
  source = "./modules/cloud-run"

  project_id            = var.project_id
  app_name              = var.app_name
  location              = var.cloud_run_location
  container_image       = "${module.artifact_registry.repository_url}/${var.app_name}:${var.docker_image_tag}"
  min_instances         = var.cloud_run_min_instances
  max_instances         = var.cloud_run_max_instances
  cpu                   = var.cloud_run_cpu
  memory                = var.cloud_run_memory
  timeout               = var.cloud_run_timeout
  concurrency           = var.cloud_run_concurrency
  service_account_email = google_service_account.cloud_run.email
  custom_domain         = var.custom_domain
  labels                = local.labels

  depends_on = [
    module.artifact_registry,
    google_service_account.cloud_run
  ]
}

# Grant Cloud Build service account permission to deploy to Cloud Run
resource "google_project_iam_member" "cloudbuild_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.cloud_build.email}"

  depends_on = [google_project_service.required_apis, google_service_account.cloud_build]
}

# Grant Cloud Build service account permission to act as Cloud Run service account
resource "google_service_account_iam_member" "cloudbuild_sa_user" {
  service_account_id = module.cloud_run.service_account_id
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.cloud_build.email}"

  depends_on = [google_project_service.required_apis, google_service_account.cloud_build]
}

# Grant Cloud Build service account permission to write logs
resource "google_project_iam_member" "cloudbuild_logs_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloud_build.email}"

  depends_on = [google_project_service.required_apis, google_service_account.cloud_build]
}

# Grant Cloud Build service account permission to push to Artifact Registry
resource "google_project_iam_member" "cloudbuild_artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.cloud_build.email}"

  depends_on = [google_project_service.required_apis, google_service_account.cloud_build]
}

# Data source for project information
data "google_project" "project" {
  project_id = var.project_id
}
