# Cloud Run Service
resource "google_cloud_run_v2_service" "app" {
  name     = "${var.app_name}-service"
  location = var.location

  deletion_protection = false
  labels              = var.labels

  template {
    service_account = var.service_account_email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = var.container_image

      # Resource limits
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
        cpu_idle          = true  # CPU throttling when no requests
        startup_cpu_boost = false # Cost optimization
      }

      env {
        name  = "NODE_ENV"
        value = var.node_env
      }

      # Port configuration
      ports {
        container_port = 3000
      }

      # Startup probe
      startup_probe {
        initial_delay_seconds = 0
        timeout_seconds       = 1
        period_seconds        = 3
        failure_threshold     = 3
        tcp_socket {
          port = 3000
        }
      }

      # Liveness probe
      liveness_probe {
        initial_delay_seconds = 0
        timeout_seconds       = 1
        period_seconds        = 10
        failure_threshold     = 3
        http_get {
          path = "/"
          port = 3000
        }
      }
    }

    timeout                          = "${var.timeout}s"
    max_instance_request_concurrency = var.concurrency

    # VPC connector (optional, for private resources)
    # vpc_access {
    #   connector = var.vpc_connector
    #   egress    = "PRIVATE_RANGES_ONLY"
    # }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# IAM policy to allow unauthenticated access (public)
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Custom domain mapping (optional)
resource "google_cloud_run_domain_mapping" "custom_domain" {
  count    = var.custom_domain != "" ? 1 : 0
  location = var.location
  name     = var.custom_domain

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.app.name
  }
}
