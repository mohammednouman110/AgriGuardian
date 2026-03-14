# AgriGuardian AI - Deployment Guide

This guide covers deploying AgriGuardian AI to various platforms including AWS, Docker, and local development.

## Prerequisites

- Docker and Docker Compose
- AWS CLI (for AWS deployment)
- PostgreSQL database
- Domain name (optional)

## Local Development

### Using Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/agriguardian-ai.git
   cd agriguardian-ai
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

1. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup:**
   ```bash
   createdb agriguardian
   psql -d agriguardian -f database/schema.sql
   ```

## Production Deployment

### Docker Deployment

1. **Build images:**
   ```bash
   # Backend
   cd backend
   docker build -t agriguardian-backend:latest .

   # Frontend
   cd frontend
   docker build -t agriguardian-frontend:latest .
   ```

2. **Run containers:**
   ```bash
   # Backend
   docker run -d -p 8000:8000 --env-file .env agriguardian-backend:latest

   # Frontend
   docker run -d -p 80:3000 agriguardian-frontend:latest
   ```

### AWS Deployment

#### Option 1: AWS Elastic Beanstalk

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB:**
   ```bash
   eb init agriguardian-ai
   ```

3. **Create environment:**
   ```bash
   eb create production
   ```

4. **Deploy:**
   ```bash
   eb deploy
   ```

#### Option 2: AWS ECS with Fargate

1. **Create ECR repositories:**
   ```bash
   aws ecr create-repository --repository-name agriguardian-backend
   aws ecr create-repository --repository-name agriguardian-frontend
   ```

2. **Build and push images:**
   ```bash
   # Get account ID
   ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

   # Backend
   docker tag agriguardian-backend:latest $ACCOUNT_ID.dkr.ecr.region.amazonaws.com/agriguardian-backend:latest
   aws ecr get-login-password | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.region.amazonaws.com
   docker push $ACCOUNT_ID.dkr.ecr.region.amazonaws.com/agriguardian-backend:latest

   # Frontend (similar process)
   ```

3. **Create ECS cluster and services using AWS Console or CloudFormation**

#### Option 3: AWS Lambda + API Gateway

1. **Package backend:**
   ```bash
   cd backend
   pip install -r requirements.txt -t .
   zip -r deployment.zip .
   ```

2. **Create Lambda function:**
   ```bash
   aws lambda create-function --function-name agriguardian-api \
     --runtime python3.9 \
     --role arn:aws:iam::account-id:role/lambda-role \
     --handler main.handler \
     --zip-file fileb://deployment.zip
   ```

3. **Create API Gateway and connect to Lambda**

### Database Setup (AWS RDS)

1. **Create PostgreSQL RDS instance:**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier agriguardian-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username agriguardian \
     --master-user-password your-password \
     --allocated-storage 20
   ```

2. **Run schema:**
   ```bash
   psql -h your-rds-endpoint -U agriguardian -d postgres -f database/schema.sql
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
GOOGLE_EARTH_ENGINE_PROJECT=your-gee-project-id
GOOGLE_EARTH_ENGINE_KEY=your-gee-service-account-key

# SMS (Twilio)
TWILIO_SID=your-twilio-account-sid
TWILIO_TOKEN=your-twilio-auth-token
TWILIO_PHONE=your-twilio-phone-number

# AWS (if using AWS services)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1

# Redis (for caching, optional)
REDIS_URL=redis://localhost:6379

# Email (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## SSL/TLS Configuration

### Using Let's Encrypt (with Nginx)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### AWS Certificate Manager

1. **Request certificate in ACM**
2. **Attach to load balancer or CloudFront distribution**

## Monitoring and Logging

### Application Monitoring

1. **Health checks:**
   - Backend: `GET /health`
   - Frontend: Implement uptime monitoring

2. **AWS CloudWatch:**
   ```bash
   aws logs create-log-group --log-group-name agriguardian-api
   aws logs create-log-stream --log-group-name agriguardian-api --log-stream-name api-logs
   ```

### Error Tracking

- **Sentry:** Add Sentry SDK for error tracking
- **AWS X-Ray:** For distributed tracing

## Backup and Recovery

### Database Backup

1. **Automated backups with AWS RDS:**
   ```bash
   aws rds create-db-snapshot \
     --db-instance-identifier agriguardian-db \
     --db-snapshot-identifier agriguardian-backup-$(date +%Y%m%d)
   ```

2. **Manual backup:**
   ```bash
   pg_dump -h your-host -U your-user -d agriguardian > backup.sql
   ```

### Model Backup

- Store trained models in S3 with versioning
- Regular backup of model artifacts

## Scaling

### Horizontal Scaling

1. **Load Balancer:**
   ```bash
   aws elbv2 create-load-balancer --name agriguardian-lb --subnets subnet-123 subnet-456
   ```

2. **Auto Scaling:**
   ```bash
   aws autoscaling create-auto-scaling-group \
     --auto-scaling-group-name agriguardian-asg \
     --launch-template LaunchTemplateId=lt-123 \
     --min-size 1 --max-size 10 --desired-capacity 3
   ```

### Database Scaling

- Use RDS read replicas for read-heavy workloads
- Implement database connection pooling

## Security Best Practices

1. **API Security:**
   - Use HTTPS everywhere
   - Implement rate limiting
   - Validate all inputs
   - Use parameterized queries

2. **Authentication:**
   - JWT tokens with short expiration
   - Refresh token rotation
   - Secure password policies

3. **Data Protection:**
   - Encrypt sensitive data at rest
   - Use VPC for network isolation
   - Regular security updates

## Performance Optimization

1. **Caching:**
   - Redis for API response caching
   - CDN for static assets

2. **Database Optimization:**
   - Add appropriate indexes
   - Query optimization
   - Connection pooling

3. **ML Model Optimization:**
   - Model quantization for faster inference
   - Batch processing for predictions

## Cost Optimization

1. **AWS Cost Management:**
   - Use reserved instances for predictable workloads
   - Implement auto-scaling to reduce costs
   - Use Spot instances for batch processing

2. **Monitoring Costs:**
   - Set up billing alerts
   - Regular cost analysis

## Troubleshooting

### Common Issues

1. **Database Connection Issues:**
   - Check security groups
   - Verify connection string
   - Check database credentials

2. **API Timeouts:**
   - Increase timeout settings
   - Check network connectivity
   - Monitor resource usage

3. **ML Model Issues:**
   - Check model file paths
   - Verify dependencies
   - Monitor memory usage

### Logs and Debugging

1. **Application Logs:**
   ```bash
   docker logs container-name
   ```

2. **AWS Logs:**
   ```bash
   aws logs tail /aws/lambda/agriguardian-api --follow
   ```

## Maintenance

### Regular Tasks

1. **Update Dependencies:**
   ```bash
   pip install --upgrade -r requirements.txt
   npm update
   ```

2. **Database Maintenance:**
   ```bash
   # Vacuum and analyze
   psql -d agriguardian -c "VACUUM ANALYZE;"
   ```

3. **Security Updates:**
   - Regular OS patching
   - Dependency updates
   - Security scans

### Backup Verification

- Test backup restoration regularly
- Verify backup integrity
- Document recovery procedures

## Support

For deployment issues, check:
- Application logs
- AWS service health dashboard
- GitHub issues
- Documentation updates

## Version History

- v1.0.0: Initial production release
- Features: Disease detection, pest prediction, satellite monitoring
- Infrastructure: Docker, AWS ECS, PostgreSQL