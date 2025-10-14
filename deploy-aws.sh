#!/bin/bash

# InPEP AWS Deployment Script
# This script helps deploy the InPEP application to AWS

set -e

echo "🚀 InPEP AWS Deployment Script"
echo "================================"

# Configuration
AWS_REGION=${AWS_REGION:-"us-east-1"}
ECR_REPOSITORY=${ECR_REPOSITORY:-"inpep-backend"}
ECS_CLUSTER=${ECS_CLUSTER:-"inpep-cluster"}
ECS_SERVICE=${ECS_SERVICE:-"inpep-backend-service"}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker not found. Please install it first."
        exit 1
    fi
    
    log_info "Prerequisites check passed ✓"
}

# Build and push Docker image
build_and_push() {
    log_info "Building Docker image..."
    
    cd server
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
    
    # Login to ECR
    log_info "Logging in to Amazon ECR..."
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}
    
    # Build image
    log_info "Building Docker image..."
    docker build -t ${ECR_REPOSITORY}:latest .
    
    # Tag image
    docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:latest
    docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:$(date +%Y%m%d-%H%M%S)
    
    # Push image
    log_info "Pushing image to ECR..."
    docker push ${ECR_URI}:latest
    docker push ${ECR_URI}:$(date +%Y%m%d-%H%M%S)
    
    cd ..
    
    log_info "Docker image pushed successfully ✓"
}

# Deploy to ECS
deploy_ecs() {
    log_info "Deploying to ECS..."
    
    # Force new deployment
    aws ecs update-service \
        --cluster ${ECS_CLUSTER} \
        --service ${ECS_SERVICE} \
        --force-new-deployment \
        --region ${AWS_REGION}
    
    log_info "ECS deployment initiated ✓"
}

# Build and deploy frontend
deploy_frontend() {
    log_info "Building frontend..."
    
    npm run build
    
    log_info "Frontend built successfully ✓"
    log_warn "Please upload the 'dist' folder to your S3 bucket or Amplify"
}

# Main menu
show_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Deploy Backend to ECS"
    echo "2) Build Frontend"
    echo "3) Full Deployment (Backend + Frontend)"
    echo "4) Exit"
    echo ""
    read -p "Enter choice [1-4]: " choice
    
    case $choice in
        1)
            check_prerequisites
            build_and_push
            deploy_ecs
            ;;
        2)
            deploy_frontend
            ;;
        3)
            check_prerequisites
            build_and_push
            deploy_ecs
            deploy_frontend
            ;;
        4)
            log_info "Exiting..."
            exit 0
            ;;
        *)
            log_error "Invalid choice"
            show_menu
            ;;
    esac
}

# Run
show_menu

log_info "Deployment completed! 🎉"
