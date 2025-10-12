# Terraform Deployment Guide

This guide explains how to deploy the Aethermancer Tools application to Google Cloud Platform using Terraform.

## Architecture

The infrastructure includes:
- **Cloud Run**: Hosts the containerized React Router SSR application
- **Artifact Registry**: Stores Docker images
- **Service Accounts**: Separate accounts for runtime and CI/CD
- **IAM Permissions**: Least-privilege access for deployments

## Prerequisites

Before you begin, ensure you have:

1. **Google Cloud Platform Account**
   - A GCP project with billing enabled
   - Owner or Editor permissions on the project

2. **Required Tools**
   - [Terraform](https://www.terraform.io/downloads) (>= 1.0)
   - [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (gcloud CLI)
   - Docker (for building images)

3. **Authentication**
   ```bash
   # Login to Google Cloud
   gcloud auth login

   # Set your project
   gcloud config set project YOUR_PROJECT_ID

   # Enable Application Default Credentials for Terraform
   gcloud auth application-default login
   ```

## Initial Setup

### 1. Configure Variables

Copy the example configuration file and customize it:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set your values:

```hcl
# Required: Your GCP Project ID
project_id = "your-actual-project-id"

# Optional: Adjust these as needed
region                     = "us-west1"
app_name                   = "aethermancer-tools"
environment                = "prod"
cloud_run_min_instances    = 0     # 0 = scales to zero for cost savings
cloud_run_max_instances    = 10
cloud_run_cpu              = "1000m"  # 1 vCPU
cloud_run_memory           = "512Mi"
```

### 2. Initialize Terraform

```bash
cd terraform
terraform init
```

This will:
- Download the Google Cloud provider
- Initialize the backend
- Set up module dependencies

### 3. Review the Plan

Preview what Terraform will create:

```bash
terraform plan
```

Review the output to ensure it matches your expectations.

### 4. Apply Infrastructure

Create the infrastructure:

```bash
terraform apply
```

Type `yes` when prompted. This will:
- Enable required GCP APIs (Cloud Run, Artifact Registry, Cloud Build)
- Create Artifact Registry repository
- Set up service accounts
- Configure IAM permissions
- Deploy Cloud Run service (initially with a placeholder image)

Save the outputs displayed after apply - you'll need them for deployment.

## Deploying the Application

### Option 1: Manual Deployment

After infrastructure is created, build and deploy your application:

```bash
# 1. Build and push Docker image
cd ../web
gcloud builds submit --tag ARTIFACT_REGISTRY_URL/aethermancer-tools:latest

# 2. Deploy to Cloud Run
gcloud run deploy aethermancer-tools-service \
  --image ARTIFACT_REGISTRY_URL/aethermancer-tools:latest \
  --region us-west1
```

Replace `ARTIFACT_REGISTRY_URL` with the output from `terraform output artifact_registry_repository_url`.

### Option 2: Automated CI/CD with Cloud Build

Create a Cloud Build trigger for automatic deployments:

1. **Create `cloudbuild.yaml` in project root:**

```yaml
steps:
  # Build the Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - '${_ARTIFACT_REGISTRY_URL}/${_APP_NAME}:$SHORT_SHA'
      - '-t'
      - '${_ARTIFACT_REGISTRY_URL}/${_APP_NAME}:latest'
      - '-f'
      - 'web/Dockerfile'
      - './web'

  # Push the image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '--all-tags'
      - '${_ARTIFACT_REGISTRY_URL}/${_APP_NAME}'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - '${_SERVICE_NAME}'
      - '--image'
      - '${_ARTIFACT_REGISTRY_URL}/${_APP_NAME}:$SHORT_SHA'
      - '--region'
      - '${_REGION}'
      - '--platform'
      - 'managed'

substitutions:
  _ARTIFACT_REGISTRY_URL: 'us-west1-docker.pkg.dev/YOUR_PROJECT_ID/aethermancer-tools-docker'
  _APP_NAME: 'aethermancer-tools'
  _SERVICE_NAME: 'aethermancer-tools-service'
  _REGION: 'us-west1'

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_8'

timeout: '1200s'
```

2. **Set up the trigger in GCP Console:**
   - Go to Cloud Build > Triggers
   - Click "Create Trigger"
   - Connect your repository
   - Set trigger to run on push to main branch
   - Use the Cloud Build service account email from Terraform outputs
   - Point to `cloudbuild.yaml`

3. **Verify permissions:**
   The Cloud Build service account created by Terraform already has the necessary permissions.

## Managing the Infrastructure

### View Current State

```bash
terraform show
```

### Update Infrastructure

After modifying `.tf` files:

```bash
terraform plan    # Preview changes
terraform apply   # Apply changes
```

### View Outputs

```bash
terraform output                              # All outputs
terraform output cloud_run_service_url        # Specific output
```

### Destroy Infrastructure

To tear down all resources:

```bash
terraform destroy
```

⚠️ **Warning**: This will permanently delete all resources. Make sure you have backups if needed.

## Common Operations

### Updating the Application

To deploy a new version:

```bash
# Manual deployment
cd web
gcloud builds submit --tag ARTIFACT_REGISTRY_URL/aethermancer-tools:v2
gcloud run deploy aethermancer-tools-service \
  --image ARTIFACT_REGISTRY_URL/aethermancer-tools:v2 \
  --region us-west1

# Or just push to your main branch if using Cloud Build triggers
```

### Viewing Logs

```bash
# Cloud Run logs
gcloud run services logs read aethermancer-tools-service --region us-west1

# Follow logs in real-time
gcloud run services logs tail aethermancer-tools-service --region us-west1
```

### Scaling Configuration

Edit `terraform/terraform.tfvars`:

```hcl
cloud_run_min_instances = 1  # Keep 1 instance always running
cloud_run_max_instances = 20 # Allow scaling to 20 instances
```

Then apply:

```bash
terraform apply
```

## Custom Domain Setup

To use a custom domain:

1. **Verify domain ownership** in GCP Console

2. **Update `terraform.tfvars`:**
   ```hcl
   custom_domain = "aethermancer.example.com"
   ```

3. **Apply changes:**
   ```bash
   terraform apply
   ```

4. **Configure DNS:**
   Add the DNS records shown in the domain mapping status.

## Cost Optimization

The default configuration is optimized for low cost:

- **Scale to Zero**: `min_instances = 0` means no charges when idle
- **Right-sized Resources**: 1 vCPU and 512Mi memory for most workloads
- **Request Timeout**: 5 minutes maximum (adjust based on your needs)

Typical costs for low-traffic apps:
- Cloud Run: $0-5/month (mostly free tier)
- Artifact Registry: ~$0.10/month for storage
- Cloud Build: First 120 build-minutes/day free

## Troubleshooting

### Terraform Init Fails

```bash
# Clear cache and reinitialize
rm -rf .terraform .terraform.lock.hcl
terraform init
```

### API Not Enabled Error

```bash
# Manually enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Permission Denied Errors

Ensure you're authenticated:
```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### Cloud Run Deployment Fails

Check the service logs:
```bash
gcloud run services logs read aethermancer-tools-service --region us-west1 --limit 50
```

Common issues:
- **Port mismatch**: Ensure app listens on port 3000
- **Build failures**: Check Dockerfile and dependencies
- **Memory limits**: Increase `cloud_run_memory` if needed

### Image Not Found

Verify the image exists:
```bash
gcloud artifacts docker images list ARTIFACT_REGISTRY_URL
```

## Security Best Practices

1. **Never commit `terraform.tfvars`** - it's gitignored for a reason
2. **Use remote state** for team collaboration (uncomment backend in `versions.tf`)
3. **Enable VPC** if connecting to private resources
4. **Review IAM permissions** regularly
5. **Use specific image tags** instead of `latest` in production

## Remote State (Team Setup)

For team collaboration, use GCS backend:

1. **Create a state bucket:**
   ```bash
   gsutil mb gs://your-terraform-state-bucket
   gsutil versioning set on gs://your-terraform-state-bucket
   ```

2. **Update `terraform/versions.tf`:**
   ```hcl
   backend "gcs" {
     bucket = "your-terraform-state-bucket"
     prefix = "terraform/state"
   }
   ```

3. **Migrate state:**
   ```bash
   terraform init -migrate-state
   ```

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

## Support

For issues specific to:
- **Infrastructure**: Check Terraform documentation and GCP Console
- **Application**: See main project README
- **Costs**: Review GCP Billing dashboard
