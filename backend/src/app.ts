import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// 导入配置
import config from './config/config';
import { redisClient } from './config/redis';
import logger from './utils/logger';

// 导入中间件
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { corsConfig } from './config/cors';

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import resumeRoutes from './routes/resume';
import jobRoutes from './routes/job';
import applicationRoutes from './routes/application';
import aiRoutes from './routes/ai';
import healthRoutes from './routes/health';

// 创建Express应用实例
const app = express();
const prisma = new PrismaClient();

// 全局中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors(corsConfig));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 请求日志中间件
app.use(requestLogger);

// 速率限制
app.use('/api/', rateLimiter);

// API路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/health', healthRoutes);

// 根路径健康检查
app.get('/', (req, res) => {
  res.json({
    message: 'Job Management Platform API',
    version: '1.0.0',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 全局错误处理中间件
app.use(errorHandler);

// 优雅关闭
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  try {
    await prisma.$disconnect();
    await redisClient.quit();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  try {
    await prisma.$disconnect();
    await redisClient.quit();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export { app, prisma };
export default app;