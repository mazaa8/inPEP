# InPEP AWS Deployment Guide

Complete guide to deploying InPEP application on Amazon Web Services.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Configuration](#configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Cost Estimation](#cost-estimation)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure AWS CLI
aws configure
# Enter: AWS Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Install Docker
# Download from: https://www.docker.com/products/docker-desktop

# Verify installations
aws --version
docker --version
```

### AWS Account Setup

1. **Create AWS Account** at https://aws.amazon.com
2. **Create IAM User** with following permissions:
   - AmazonEC2FullAccess
   - AmazonECSFullAccess
   - AmazonRDSFullAccess
   - AmazonS3FullAccess
   - CloudFormationFullAccess
   - IAMFullAccess
3. **Generate Access Keys** for the IAM user

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Route 53   │────────▶│  CloudFront  │                 │
│  │    (DNS)     │         │    (CDN)     │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                          ┌────────▼────────┐                │
│                          │   S3 Bucket     │                │
│                          │   (Frontend)    │                │
│                          └─────────────────┘                │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │     ALB      │────────▶│  ECS Fargate │                 │
│  │ (Load Bal.)  │         │  (Backend)   │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                          ┌────────▼────────┐                │
│                          │  RDS PostgreSQL │                │
│                          │   (Database)    │                │
│                          └─────────────────┘                │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  S3 Bucket   │         │  CloudWatch  │                 │
│  │  (Uploads)   │         │  (Logging)   │                 │
│  └──────────────┘         └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Deployment

### Phase 1: Infrastructure Setup (CloudFormation)

```bash
# 1. Deploy infrastructure using CloudFormation
aws cloudformation create-stack \
  --stack-name inpep-infrastructure \
  --template-body file://aws-infrastructure.yaml \
  --parameters \
    ParameterKey=EnvironmentName,ParameterValue=production \
    ParameterKey=DBUsername,ParameterValue=inpep_admin \
    ParameterKey=DBPassword,ParameterValue=YOUR_SECURE_PASSWORD \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# 2. Wait for stack creation (takes ~15-20 minutes)
aws cloudformation wait stack-create-complete \
  --stack-name inpep-infrastructure \
  --region us-east-1

# 3. Get stack outputs
aws cloudformation describe-stacks \
  --stack-name inpep-infrastructure \
  --query 'Stacks[0].Outputs' \
  --region us-east-1
```

### Phase 2: Database Setup

```bash
# 1. Get RDS endpoint from CloudFormation outputs
RDS_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name inpep-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' \
  --output text)

# 2. Connect to RDS (from EC2 or local with VPN)
psql -h $RDS_ENDPOINT -U inpep_admin -d postgres

# 3. Create database
CREATE DATABASE inpep;

# 4. Run Prisma migrations
cd server
DATABASE_URL="postgresql://inpep_admin:PASSWORD@$RDS_ENDPOINT:5432/inpep" npx prisma migrate deploy
DATABASE_URL="postgresql://inpep_admin:PASSWORD@$RDS_ENDPOINT:5432/inpep" npx prisma generate
```

### Phase 3: Backend Deployment (ECS)

```bash
# 1. Get ECR repository URI
ECR_URI=$(aws cloudformation describe-stacks \
  --stack-name inpep-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
  --output text)

# 2. Build and push Docker image
cd server
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URI
docker build -t inpep-backend .
docker tag inpep-backend:latest $ECR_URI:latest
docker push $ECR_URI:latest

# 3. Create ECS Task Definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json

# 4. Create ECS Service
aws ecs create-service \
  --cluster production-inpep-cluster \
  --service-name inpep-backend-service \
  --task-definition inpep-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### Phase 4: Frontend Deployment (Amplify)

#### Option A: Using AWS Amplify (Recommended)

```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Initialize Amplify
amplify init

# 3. Add hosting
amplify add hosting

# 4. Configure build settings
# Create amplify.yml in project root (see below)

# 5. Deploy
amplify publish
```

**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Option B: Using S3 + CloudFront

```bash
# 1. Build frontend
npm run build

# 2. Create S3 bucket
aws s3 mb s3://inpep-frontend --region us-east-1

# 3. Configure bucket for static website hosting
aws s3 website s3://inpep-frontend \
  --index-document index.html \
  --error-document index.html

# 4. Upload build files
aws s3 sync dist/ s3://inpep-frontend --delete

# 5. Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name inpep-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

---

## Configuration

### Environment Variables

**Backend (.env.production):**
```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://inpep_admin:PASSWORD@RDS_ENDPOINT:5432/inpep

# JWT
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars

# AWS
AWS_REGION=us-east-1
AWS_S3_BUCKET=production-inpep-uploads

# CORS
FRONTEND_URL=https://inpep.com

# Socket.IO
SOCKET_CORS_ORIGIN=https://inpep.com
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://api.inpep.com
VITE_SOCKET_URL=https://api.inpep.com
VITE_ENV=production
```

### ECS Task Definition (ecs-task-definition.json)

```json
{
  "family": "inpep-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "inpep-backend",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inpep-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:inpep/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:inpep/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/inpep-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

---

## Monitoring & Maintenance

### CloudWatch Alarms

```bash
# CPU Utilization Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name inpep-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Database Connections Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name inpep-db-connections \
  --alarm-description "Alert when DB connections exceed 80" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### Logging

```bash
# View ECS logs
aws logs tail /ecs/inpep-backend --follow

# View RDS logs
aws rds describe-db-log-files --db-instance-identifier production-inpep-db
```

### Backups

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier production-inpep-db \
  --db-snapshot-identifier inpep-backup-$(date +%Y%m%d)

# Backup S3 bucket
aws s3 sync s3://production-inpep-uploads s3://production-inpep-backups/$(date +%Y%m%d)
```

---

## Cost Estimation

### Monthly AWS Costs (Approximate)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| **ECS Fargate** | 2 tasks, 0.5 vCPU, 1GB RAM | $30-40 |
| **RDS PostgreSQL** | db.t3.micro, 20GB storage | $15-20 |
| **Application Load Balancer** | Standard ALB | $20-25 |
| **S3** | 10GB storage, 100GB transfer | $5-10 |
| **CloudFront** | 100GB transfer | $10-15 |
| **Route 53** | 1 hosted zone | $0.50 |
| **CloudWatch** | Logs & Metrics | $5-10 |
| **Data Transfer** | Outbound data | $10-20 |
| **Total** | | **$95-140/month** |

### Cost Optimization Tips

1. **Use Fargate Spot** for non-critical tasks (70% savings)
2. **Enable RDS Auto Scaling** for storage
3. **Use S3 Intelligent-Tiering** for uploads
4. **Set up CloudWatch log retention** (7-30 days)
5. **Use Reserved Instances** for predictable workloads (40% savings)

---

## Troubleshooting

### Common Issues

#### 1. ECS Task Fails to Start

```bash
# Check task logs
aws ecs describe-tasks --cluster production-inpep-cluster --tasks TASK_ID

# Check CloudWatch logs
aws logs tail /ecs/inpep-backend --follow
```

**Solution:** Verify environment variables and secrets are correctly configured.

#### 2. Database Connection Issues

```bash
# Test connectivity from ECS task
aws ecs execute-command \
  --cluster production-inpep-cluster \
  --task TASK_ID \
  --container inpep-backend \
  --interactive \
  --command "/bin/sh"

# Inside container
nc -zv RDS_ENDPOINT 5432
```

**Solution:** Check security group rules allow traffic from ECS to RDS.

#### 3. Frontend Can't Connect to Backend

**Solution:** 
- Verify CORS settings in backend
- Check ALB security group allows traffic from internet
- Ensure frontend has correct API URL

#### 4. High Costs

```bash
# Check cost breakdown
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE
```

**Solution:** Review unused resources, enable auto-scaling, use Spot instances.

---

## Quick Deployment Script

Use the provided `deploy-aws.sh` script for automated deployment:

```bash
# Make script executable
chmod +x deploy-aws.sh

# Run deployment
./deploy-aws.sh
```

---

## Security Best Practices

1. ✅ **Enable encryption at rest** for RDS and S3
2. ✅ **Use AWS Secrets Manager** for sensitive data
3. ✅ **Enable VPC Flow Logs** for network monitoring
4. ✅ **Set up AWS WAF** for DDoS protection
5. ✅ **Enable MFA** for AWS root account
6. ✅ **Use IAM roles** instead of access keys
7. ✅ **Regular security audits** with AWS Inspector
8. ✅ **Enable CloudTrail** for audit logging

---

## Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com
- **AWS Support**: https://console.aws.amazon.com/support
- **AWS Cost Calculator**: https://calculator.aws
- **AWS Well-Architected Framework**: https://aws.amazon.com/architecture/well-architected

---

## Next Steps

1. ✅ Set up custom domain with Route 53
2. ✅ Configure SSL certificate with ACM
3. ✅ Set up CI/CD with AWS CodePipeline
4. ✅ Enable auto-scaling for ECS
5. ✅ Set up monitoring dashboards
6. ✅ Configure automated backups
7. ✅ Implement disaster recovery plan

---

**Need Help?** Contact your AWS Solutions Architect or refer to the AWS Support Center.
