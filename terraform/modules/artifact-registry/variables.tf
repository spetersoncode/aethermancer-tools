variable "location" {
  description = "The location for the Artifact Registry"
  type        = string
}

variable "repository_id" {
  description = "The repository ID"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "labels" {
  description = "Labels to apply to the repository"
  type        = map(string)
  default     = {}
}

variable "cleanup_retention_days" {
  description = "Number of days to retain artifacts before cleanup (older artifacts will be deleted)"
  type        = number
  default     = 30
}

variable "cleanup_keep_count" {
  description = "Minimum number of most recent artifacts to keep regardless of age"
  type        = number
  default     = 1
}
