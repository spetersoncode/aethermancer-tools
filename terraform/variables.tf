variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region for resources"
  type        = string
  default     = "us-west1"
}

variable "app_name" {
  description = "Application name (used for resource naming)"
  type        = string
  default     = "aethermancer-tools"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

# Artifact Registry Variables
variable "artifact_registry_location" {
  description = "Location for Artifact Registry"
  type        = string
  default     = "us-west1"
}

# Cloud Run Variables
variable "cloud_run_location" {
  description = "Location for Cloud Run service"
  type        = string
  default     = "us-west1"
}

variable "cloud_run_min_instances" {
  description = "Minimum number of Cloud Run instances (0 for cost optimization)"
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}

variable "cloud_run_cpu" {
  description = "CPU allocation for Cloud Run (1000m = 1 vCPU)"
  type        = string
  default     = "1000m"
}

variable "cloud_run_memory" {
  description = "Memory allocation for Cloud Run"
  type        = string
  default     = "512Mi"
}

variable "cloud_run_timeout" {
  description = "Request timeout in seconds"
  type        = number
  default     = 300
}

variable "cloud_run_concurrency" {
  description = "Maximum concurrent requests per instance"
  type        = number
  default     = 80
}

# Domain Variables (optional)
variable "custom_domain" {
  description = "Custom domain for the application (optional)"
  type        = string
  default     = ""
}

# Build Variables
variable "docker_image_tag" {
  description = "Docker image tag to deploy (e.g., latest, v1.0.0)"
  type        = string
  default     = "latest"
}
