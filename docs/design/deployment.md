# 部署指南

## 🚀 部署架构

### 生产环境架构
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Servers    │    │    Database     │
│    (Nginx)      │────│  (Node.js x3)    │────│  (PostgreSQL)   │
│                 │    │                  │    │   + Redis       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐             │
         └──────────────│  Static Assets   │─────────────┘
                        │     (CDN)        │
                        └──────────────────┘
```

### 部署环境
- **开发环境**: 本地开发和测试
- **预发布环境**: 生产前最终验证
- **生产环境**: 正式对外服务

## 🐳 Docker部署

### Dockerfile配置

#### 前端Dockerfile
```dockerfile
# Multi-stage build for React app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 后端Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

USER nodeuser

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose配置

```yaml
version: '3.8'

services:
  # 前端服务
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:3000
    networks:
      - app-network

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://jobtracker:password@postgres:5432/jobtracker
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    volumes:
      - ./uploads:/app/uploads
    networks:
      - app-network

  # 数据库服务
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: jobtracker
      POSTGRES_USER: jobtracker
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network

  # Redis缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # Nginx负载均衡
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## ☁️ 云服务部署

### AWS部署

#### ECS (Elastic Container Service)
```yaml
# docker-compose.override.yml for AWS
version: '3.8'

services:
  backend:
    image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/jobtracker-backend:latest
    environment:
      - DATABASE_URL=${RDS_DATABASE_URL}
      - REDIS_URL=${ELASTICACHE_REDIS_URL}
      - S3_BUCKET=${S3_BUCKET_NAME}
    secrets:
      - source: openai_api_key
        target: OPENAI_API_KEY
      - source: jwt_secret
        target: JWT_SECRET

  postgres:
    # Use RDS instead of container
    external: true

  redis:
    # Use ElastiCache instead of container  
    external: true

secrets:
  openai_api_key:
    external: true
  jwt_secret:
    external: true
```

#### Terraform基础设施配置
```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC配置
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "jobtracker-vpc"
  }
}

# RDS数据库
resource "aws_db_instance" "postgres" {
  identifier = "jobtracker-db"
  
  engine         = "postgres"
  engine_version = "15.2"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "jobtracker"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_window      = "03:00-04:00"
  maintenance_window = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  deletion_protection = true
  
  tags = {
    Name = "jobtracker-postgres"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "jobtracker-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

# ECS集群
resource "aws_ecs_cluster" "main" {
  name = "jobtracker-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# S3存储桶
resource "aws_s3_bucket" "uploads" {
  bucket = "jobtracker-uploads-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

### Vercel部署 (前端)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api-url",
    "REACT_APP_OPENAI_API_KEY": "@openai-api-key"
  },
  "build": {
    "env": {
      "REACT_APP_API_URL": "@api-url"
    }
  }
}
```

### Heroku部署 (后端)

```yaml
# heroku.yml
build:
  docker:
    web: backend/Dockerfile
release:
  image: web
  command:
    - npx prisma migrate deploy
    - npx prisma generate
run:
  web: npm start
```

```json
{
  "scripts": {
    "heroku-prebuild": "npx prisma generate",
    "heroku-postbuild": "npx prisma migrate deploy"
  }
}
```

## 🌐 CDN和静态资源

### Cloudflare配置
```javascript
// cloudflare-worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 缓存策略
    if (url.pathname.startsWith('/static/')) {
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);
      const cachedResponse = await cache.match(cacheKey);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      const response = await fetch(request);
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cache-Control', 'public, max-age=31536000');
      
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
      
      ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
      return newResponse;
    }
    
    return fetch(request);
  },
};
```

### AWS CloudFront配置
```json
{
  "DistributionConfig": {
    "CallerReference": "jobtracker-cdn",
    "Origins": [
      {
        "Id": "S3-jobtracker-static",
        "DomainName": "jobtracker-static.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-jobtracker-static",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "managed-caching-optimized",
      "Compress": true
    },
    "CacheBehaviors": [
      {
        "PathPattern": "/api/*",
        "TargetOriginId": "ALB-jobtracker-api",
        "CachePolicyId": "managed-caching-disabled"
      }
    ],
    "Enabled": true,
    "PriceClass": "PriceClass_100"
  }
}
```

## 🔧 CI/CD流水线

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
    
    - name: Run tests
      run: |
        cd backend && npm test
        cd ../frontend && npm test -- --coverage --watchAll=false
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push backend image
      run: |
        docker build -t jobtracker-backend ./backend
        docker tag jobtracker-backend:latest $ECR_REGISTRY/jobtracker-backend:latest
        docker push $ECR_REGISTRY/jobtracker-backend:latest
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster jobtracker-cluster \
          --service jobtracker-backend-service \
          --force-new-deployment
    
    - name: Deploy frontend to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./frontend
        vercel-args: '--prod'
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  POSTGRES_DB: test
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres

test:
  stage: test
  image: node:18
  services:
    - postgres:15
  script:
    - cd backend && npm ci
    - npm test
    - cd ../frontend && npm ci
    - npm test -- --coverage --watchAll=false
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA ./backend
    - docker build -t $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA ./frontend
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
  only:
    - main

deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST "$WEBHOOK_URL" 
      -H "Content-Type: application/json" 
      -d '{"image":"'$CI_REGISTRY_IMAGE'/backend:'$CI_COMMIT_SHA'"}'
  environment:
    name: production
    url: https://jobtracker.com
  only:
    - main
```

## 🔍 监控和日志

### Prometheus + Grafana
```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

volumes:
  grafana-data:
```

### ELK Stack日志收集
```yaml
# logging/docker-compose.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.6.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.6.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.6.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/config:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

volumes:
  es-data:
```

### 应用监控配置
```javascript
// backend/src/middleware/monitoring.js
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

module.exports = {
  metricsMiddleware: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route ? req.route.path : req.path;
      
      httpRequestDuration
        .labels(req.method, route, res.statusCode)
        .observe(duration);
      
      httpRequestsTotal
        .labels(req.method, route, res.statusCode)
        .inc();
    });
    
    next();
  },
  
  register: promClient.register
};
```

## 🚨 错误处理和恢复

### 健康检查端点
```javascript
// backend/src/routes/health.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');

const router = express.Router();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

router.get('/health', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    openai: false,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  try {
    // 数据库检查
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Redis检查
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  try {
    // OpenAI API检查
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    checks.openai = response.ok;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
  }

  const isHealthy = checks.database && checks.redis && checks.openai;
  
  res.status(isHealthy ? 200 : 503).json(checks);
});

router.get('/readiness', async (req, res) => {
  // 检查应用是否准备好接收请求
  const ready = {
    database: false,
    migrations: false,
    timestamp: new Date().toISOString()
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    ready.database = true;
    
    // 检查数据库迁移状态
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations 
      WHERE finished_at IS NULL
    `;
    ready.migrations = migrations.length === 0;
  } catch (error) {
    console.error('Readiness check failed:', error);
  }

  const isReady = ready.database && ready.migrations;
  res.status(isReady ? 200 : 503).json(ready);
});

module.exports = router;
```

### 备份和恢复策略

```bash
#!/bin/bash
# scripts/backup.sh

set -e

# 配置
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-jobtracker}"
DB_USER="${DB_USER:-jobtracker}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
S3_BUCKET="${S3_BUCKET:-jobtracker-backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "开始备份数据库..."

# 创建数据库备份
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# 压缩备份文件
gzip $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# 上传到S3
aws s3 cp $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz s3://$S3_BUCKET/database/

# 清理本地旧备份（保留7天）
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz /app/uploads/
aws s3 cp $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz s3://$S3_BUCKET/uploads/

echo "备份完成: db_backup_$TIMESTAMP.sql.gz"
```

```bash
#!/bin/bash
# scripts/restore.sh

set -e

BACKUP_FILE=$1
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-jobtracker}"
DB_USER="${DB_USER:-jobtracker}"

if [ -z "$BACKUP_FILE" ]; then
    echo "使用方法: ./restore.sh <backup_file>"
    exit 1
fi

echo "开始恢复数据库从: $BACKUP_FILE"

# 从S3下载备份文件
aws s3 cp s3://jobtracker-backups/database/$BACKUP_FILE /tmp/

# 解压备份文件
gunzip /tmp/$BACKUP_FILE

# 恢复数据库
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < /tmp/${BACKUP_FILE%.gz}

echo "数据库恢复完成"
```

## 📈 性能优化

### 缓存策略
```javascript
// backend/src/services/cacheService.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

class CacheService {
  static TTL = {
    USER_PROFILE: 3600,      // 1小时
    JOB_LISTINGS: 1800,      // 30分钟
    AI_ANALYSIS: 86400,      // 24小时
    STATIC_DATA: 604800      // 7天
  };

  static async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key, data, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async invalidate(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  // 用户相关缓存
  static getUserKey(userId) {
    return `user:${userId}`;
  }

  // AI分析缓存
  static getAnalysisKey(resumeId, jobId = '') {
    return `analysis:${resumeId}:${jobId}`;
  }

  // 职位列表缓存
  static getJobListKey(filters) {
    const filterKey = Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|');
    return `jobs:${filterKey}`;
  }
}

module.exports = CacheService;
```

### 数据库优化
```sql
-- 性能优化索引
CREATE INDEX CONCURRENTLY idx_applications_user_status 
ON applications(user_id, status);

CREATE INDEX CONCURRENTLY idx_jobs_location_salary 
ON jobs(location, salary_min, salary_max);

CREATE INDEX CONCURRENTLY idx_resumes_user_updated 
ON resumes(user_id, updated_at DESC);

-- 分区表策略
CREATE TABLE ai_analyses_2024 PARTITION OF ai_analyses 
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- 数据库连接池优化
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
```

这个部署指南涵盖了从开发环境到生产环境的完整部署流程，包括容器化、云服务集成、监控日志、备份恢复等关键环节，为项目的稳定运行提供了全面的保障。