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
