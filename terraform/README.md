# Terraform Deployment Guide

Infrastructure as Code for deploying Aethermancer Tools to Google Cloud Platform.

## Architecture

- **Cloud Run**: Serverless container hosting with auto-scaling
- **Artifact Registry**: Docker image repository
- **Service Accounts**: Separate accounts for runtime and CI/CD
- **IAM Permissions**: Least-privilege access controls

## Prerequisites

1. **Google Cloud Platform**
   - Active GCP project with billing enabled
   - Owner or Editor permissions

2. **Required Tools**
   - [Terraform](https://www.terraform.io/downloads) (>= 1.0)
   - [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (gcloud CLI)

3. **Authentication**
   ```bash
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```

## Quick Start

### 1. Configure Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
project_id = "your-gcp-project-id"  # REQUIRED

# Optional - adjust as needed
region                   = "us-west1"
app_name                 = "aethermancer-tools"
environment              = "prod"
cloud_run_min_instances  = 0      # 0 = scales to zero for cost savings
cloud_run_max_instances  = 10
cloud_run_cpu            = "1000m" # 1 vCPU
cloud_run_memory         = "512Mi"
```

### 2. Deploy Infrastructure

```bash
terraform init
terraform plan      # Review what will be created
terraform apply     # Type 'yes' to confirm
```

Save the outputs - you'll need them for deployment.

### 3. Get Your URLs

```bash
terraform output artifact_registry_repository_url
terraform output cloud_run_service_url
```

## Deploying Your Application

### Option 1: Manual Deployment

```bash
# Build and push Docker image
cd ../web
gcloud builds submit --tag ARTIFACT_REGISTRY_URL/aethermancer-tools:latest

# Deploy to Cloud Run
gcloud run deploy aethermancer-tools-service \
  --image ARTIFACT_REGISTRY_URL/aethermancer-tools:latest \
  --region us-west1
```

Replace `ARTIFACT_REGISTRY_URL` with the output from `terraform output artifact_registry_repository_url`.

### Option 2: Automated CI/CD with Cloud Build

The project includes a `cloudbuild.yaml` in the root directory that's ready to use.

**Set up the trigger:**
1. Go to Cloud Build > Triggers in GCP Console
2. Click "Create Trigger"
3. Connect your repository
4. Set trigger to run on push to main branch
5. Point to the existing `cloudbuild.yaml` in the repository root
6. Use the Cloud Build service account from: `terraform output cloud_build_service_account_email`

## Common Operations

### View All Outputs
```bash
terraform output
```

### Update Application
```bash
# If using Cloud Build - just push to main branch
git push origin main

# Manual deployment
cd web
gcloud builds submit --tag ARTIFACT_REGISTRY_URL/aethermancer-tools:v2
gcloud run deploy aethermancer-tools-service \
  --image ARTIFACT_REGISTRY_URL/aethermancer-tools:v2 \
  --region us-west1
```

### View Logs
```bash
gcloud run services logs read aethermancer-tools-service --region us-west1
gcloud run services logs tail aethermancer-tools-service --region us-west1  # Follow
```

### Scale Configuration

Edit `terraform.tfvars`:

```hcl
cloud_run_min_instances = 1    # Keep warm instance
cloud_run_max_instances = 20   # Handle higher traffic
cloud_run_cpu           = "2000m"
cloud_run_memory        = "1Gi"
```

Apply changes:
```bash
terraform apply
```

### Custom Domain

1. Edit `terraform.tfvars`:
   ```hcl
   custom_domain = "app.example.com"
   ```

2. Apply changes:
   ```bash
   terraform apply
   ```

3. Add DNS records as shown in GCP Console (Cloud Run > Domain Mappings)

### Destroy Infrastructure

```bash
terraform destroy
```

## Configuration Reference

### Key Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `project_id` | (required) | Your GCP Project ID |
| `region` | `us-west1` | Primary GCP region |
| `app_name` | `aethermancer-tools` | Application name |
| `cloud_run_min_instances` | `0` | Min instances (0 = scale to zero) |
| `cloud_run_max_instances` | `10` | Maximum instances |
| `cloud_run_cpu` | `1000m` | CPU per instance (1000m = 1 vCPU) |
| `cloud_run_memory` | `512Mi` | Memory per instance |
| `custom_domain` | `""` | Optional custom domain |

See `terraform.tfvars.example` for all available options.

## Module Structure

### artifact-registry (`./modules/artifact-registry`)
Creates Docker repository in Artifact Registry.

**Outputs**: `repository_url`, `location`

### cloud-run (`./modules/cloud-run`)
Deploys containerized app to Cloud Run with health checks.

**Outputs**: `service_url`, `service_name`, `service_account_email`

## Cost Optimization

Default configuration minimizes costs:
- **Scale to zero**: No charges when idle
- **Right-sized resources**: 1 vCPU, 512Mi RAM
- **CPU throttling**: Throttled when no requests

**Typical costs:**
- Idle: ~$0/month
- Low traffic (10k requests/month): ~$1-2/month
- Medium traffic (100k requests/month): ~$5-10/month

See [Cloud Run Pricing](https://cloud.google.com/run/pricing) for details.

## State Management

### Local State (Default)
State stored in `terraform.tfstate`. Fine for single-user development.

**Never commit state files to git** (already in `.gitignore`).

### Remote State (Recommended for Teams)

1. Create state bucket:
   ```bash
   gsutil mb gs://your-terraform-state-bucket
   gsutil versioning set on gs://your-terraform-state-bucket
   ```

2. Uncomment backend config in `versions.tf`:
   ```hcl
   backend "gcs" {
     bucket = "your-terraform-state-bucket"
     prefix = "terraform/state"
   }
   ```

3. Migrate state:
   ```bash
   terraform init -migrate-state
   ```

## Troubleshooting

### Authentication Issues
```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### APIs Not Enabled
```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Terraform Init Fails
```bash
rm -rf .terraform .terraform.lock.hcl
terraform init
```

### Cloud Run Deployment Fails
Check logs:
```bash
gcloud run services logs read aethermancer-tools-service --region us-west1 --limit 50
```

Common issues:
- Port mismatch (app must listen on port 3000)
- Build failures (check Dockerfile)
- Memory limits (increase `cloud_run_memory`)

### Image Not Found
Verify image exists:
```bash
gcloud artifacts docker images list ARTIFACT_REGISTRY_URL
```

## Security Best Practices

1. **Never commit** `terraform.tfvars` or `terraform.tfstate`
2. **Use remote state** for team collaboration
3. **Review IAM permissions** regularly
4. **Use specific image tags** in production (not `latest`)
5. **Enable VPC connector** if connecting to private resources
6. **Use Secret Manager** for sensitive values (not Terraform variables)

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
