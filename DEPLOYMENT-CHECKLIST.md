# InPEP AWS Deployment Checklist

Use this checklist to ensure a smooth deployment to AWS.

## 📝 Pre-Deployment Checklist

### AWS Account Setup
- [ ] AWS account created
- [ ] IAM user created with appropriate permissions
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Access keys generated and stored securely
- [ ] Billing alerts configured

### Local Environment
- [ ] Docker installed and running
- [ ] Node.js 20+ installed
- [ ] Git repository up to date
- [ ] All dependencies installed (`npm install`)
- [ ] Application tested locally
- [ ] Environment variables documented

### Code Preparation
- [ ] All sensitive data removed from code
- [ ] Database migrations tested
- [ ] API endpoints documented
- [ ] Frontend build tested (`npm run build`)
- [ ] Backend build tested (`npm run build`)
- [ ] Health check endpoint implemented (`/health`)

## 🚀 Deployment Steps

### Phase 1: Infrastructure (30-45 minutes)
- [ ] Review `aws-infrastructure.yaml` CloudFormation template
- [ ] Set database password (min 8 characters)
- [ ] Deploy CloudFormation stack
- [ ] Wait for stack creation to complete
- [ ] Note down stack outputs (RDS endpoint, ECR URI, etc.)
- [ ] Verify VPC and subnets created
- [ ] Verify security groups configured

### Phase 2: Database Setup (15-20 minutes)
- [ ] Connect to RDS instance
- [ ] Create `inpep` database
- [ ] Run Prisma migrations
- [ ] Seed initial data (if needed)
- [ ] Test database connection
- [ ] Configure automated backups
- [ ] Enable encryption at rest

### Phase 3: Backend Deployment (20-30 minutes)
- [ ] Review and update `server/Dockerfile`
- [ ] Build Docker image locally
- [ ] Test Docker image locally
- [ ] Login to ECR
- [ ] Push image to ECR
- [ ] Create/update ECS task definition
- [ ] Create/update ECS service
- [ ] Configure environment variables
- [ ] Configure secrets in AWS Secrets Manager
- [ ] Verify tasks are running
- [ ] Test API endpoints via ALB

### Phase 4: Frontend Deployment (15-20 minutes)

#### Option A: AWS Amplify
- [ ] Connect GitHub repository to Amplify
- [ ] Configure build settings (`amplify.yml`)
- [ ] Set environment variables in Amplify console
- [ ] Trigger first deployment
- [ ] Verify build succeeds
- [ ] Test deployed application
- [ ] Configure custom domain (optional)
- [ ] Enable SSL certificate

#### Option B: S3 + CloudFront
- [ ] Build frontend (`npm run build`)
- [ ] Create S3 bucket
- [ ] Configure bucket for static hosting
- [ ] Upload build files to S3
- [ ] Create CloudFront distribution
- [ ] Configure SSL certificate with ACM
- [ ] Update DNS records
- [ ] Test CDN distribution

### Phase 5: Configuration (10-15 minutes)
- [ ] Update frontend API URL to point to ALB
- [ ] Configure CORS in backend
- [ ] Set up CloudWatch log groups
- [ ] Configure CloudWatch alarms
- [ ] Set up SNS notifications for alarms
- [ ] Test end-to-end application flow

## 🔒 Security Checklist

- [ ] All passwords stored in AWS Secrets Manager
- [ ] Database not publicly accessible
- [ ] Security groups follow least privilege principle
- [ ] SSL/TLS enabled for all endpoints
- [ ] S3 buckets have public access blocked
- [ ] IAM roles use minimum required permissions
- [ ] CloudTrail enabled for audit logging
- [ ] VPC Flow Logs enabled
- [ ] MFA enabled for root account
- [ ] Regular security patches scheduled

## 📊 Monitoring & Logging

- [ ] CloudWatch Logs configured for ECS
- [ ] CloudWatch Logs configured for RDS
- [ ] CloudWatch Alarms set up:
  - [ ] High CPU usage (>80%)
  - [ ] High memory usage (>80%)
  - [ ] Database connections (>80)
  - [ ] 5xx errors (>10 in 5 min)
  - [ ] Response time (>2 seconds)
- [ ] CloudWatch Dashboard created
- [ ] Log retention policy set (7-30 days)
- [ ] SNS topic for alerts configured
- [ ] Email notifications configured

## 🔄 CI/CD Setup (Optional)

- [ ] GitHub Actions workflow created
- [ ] AWS credentials stored in GitHub Secrets
- [ ] Automated tests configured
- [ ] Automated deployment on push to main
- [ ] Rollback strategy defined
- [ ] Blue-green deployment configured (optional)

## 💰 Cost Optimization

- [ ] Right-sized EC2/Fargate instances
- [ ] Auto-scaling configured
- [ ] Fargate Spot enabled for non-critical tasks
- [ ] S3 lifecycle policies configured
- [ ] CloudWatch log retention optimized
- [ ] Unused resources identified and removed
- [ ] Reserved instances purchased (if applicable)
- [ ] Cost allocation tags applied
- [ ] Billing alerts configured

## 🧪 Testing Checklist

### Backend Testing
- [ ] Health check endpoint responds (`/health`)
- [ ] Authentication works
- [ ] Database queries successful
- [ ] File uploads work (S3)
- [ ] WebSocket connections work
- [ ] API rate limiting configured
- [ ] Error handling works correctly

### Frontend Testing
- [ ] Application loads correctly
- [ ] All pages accessible
- [ ] API calls successful
- [ ] Authentication flow works
- [ ] File uploads work
- [ ] Real-time features work (Socket.IO)
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] CDN cache hit ratio > 80%
- [ ] Concurrent users tested (100+)

## 📋 Post-Deployment

- [ ] Verify all features working in production
- [ ] Monitor CloudWatch metrics for 24 hours
- [ ] Check for any errors in logs
- [ ] Test disaster recovery procedure
- [ ] Document any issues encountered
- [ ] Update team on deployment status
- [ ] Schedule post-deployment review
- [ ] Create runbook for common operations

## 🆘 Rollback Plan

In case of issues:

1. **Backend Rollback:**
   ```bash
   # Revert to previous task definition
   aws ecs update-service \
     --cluster production-inpep-cluster \
     --service inpep-backend-service \
     --task-definition inpep-backend:PREVIOUS_VERSION
   ```

2. **Frontend Rollback (Amplify):**
   - Go to Amplify Console
   - Select previous deployment
   - Click "Redeploy this version"

3. **Frontend Rollback (S3):**
   ```bash
   # Restore from backup
   aws s3 sync s3://inpep-backups/YYYYMMDD/ s3://inpep-frontend/
   ```

4. **Database Rollback:**
   ```bash
   # Restore from snapshot
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier production-inpep-db-restored \
     --db-snapshot-identifier inpep-backup-YYYYMMDD
   ```

## 📞 Emergency Contacts

- **AWS Support:** https://console.aws.amazon.com/support
- **Team Lead:** [Name/Email]
- **DevOps Engineer:** [Name/Email]
- **Database Admin:** [Name/Email]

## 📚 Documentation

- [ ] Architecture diagram updated
- [ ] API documentation updated
- [ ] Deployment guide reviewed
- [ ] Runbook created
- [ ] Disaster recovery plan documented
- [ ] Team trained on new deployment

## ✅ Sign-Off

- [ ] Technical Lead Approval: _________________ Date: _______
- [ ] Security Review Complete: ________________ Date: _______
- [ ] QA Testing Complete: ____________________ Date: _______
- [ ] Deployment Complete: ____________________ Date: _______

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________
**Notes:** 
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
