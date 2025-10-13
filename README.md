# Aethermancer Tools

A modern web application providing companion tools for Aethermancer players to track their monster collection and build optimal teams.

## Features

- **Aetherdex**: Comprehensive collection tracker with import/export functionality
- **Team Builder**: Interactive team composition tool with real-time analysis
- **Dark Mode**: Full theme support with toggle
- **Responsive Design**: Optimized for mobile and desktop

## Repository Structure

```
aethermancer-tools/
├── web/              # React web application
│   └── README.md     # Detailed setup and development guide
├── terraform/        # GCP infrastructure as code
│   └── README.md     # Deployment and infrastructure guide
└── cloudbuild.yaml   # Automated CI/CD configuration
```

## Quick Start

### Local Development

```bash
cd web
pnpm install
pnpm dev
```

Visit `http://localhost:5173` to see the application.

See [web/README.md](web/README.md) for detailed development instructions.

### Docker

```bash
cd web
docker build -t aethermancer-tools-web .
docker run -p 3000:3000 aethermancer-tools-web
```

## Deployment

### Google Cloud Platform

This project includes Terraform configurations for deploying to GCP with Cloud Run:

```bash
cd terraform
terraform init
terraform apply
```

See [terraform/README.md](terraform/README.md) for complete deployment instructions and configuration options.

### Automated CI/CD

The included `cloudbuild.yaml` enables automated deployments via Google Cloud Build when pushing to the main branch.

## Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide
- **Infrastructure**: Terraform, Google Cloud Run, Artifact Registry
- **CI/CD**: Google Cloud Build

## About Aethermancer

Aethermancer is a monster collecting and battling game. This application provides companion tools to help players track their progress and strategize their teams.

## Documentation

- [Web Application Documentation](web/README.md)
- [Infrastructure & Deployment Guide](terraform/README.md)
