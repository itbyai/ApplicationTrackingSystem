import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import config from '../config';
import logger from '../utils/logger';

// 自定义密钥生成器
const keyGenerator = (req: Request): string => {
  // 优先使用用户ID，其次使用IP地址
  const userId = (req as any).user?.id;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  return userId ? `rate_limit:user:${userId}` : `rate_limit:ip:${ip}`;
};

// 跳过成功响应的计数
const skip = (req: Request, res: Response): boolean => {
  return res.statusCode < 400;
};

// 请求被限制时的处理函数
const limitHandler = (req: Request, res: Response): void => {
  const clientIP = req.ip || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  
  logger.warn('Rate limit exceeded', {
    ip: clientIP,
    userAgent,
    path: req.path,
    method: req.method
  });

  res.status(429).json({
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000)
  });
};

// 基本速率限制配置
export const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  keyGenerator,
  skip,
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// 严格的速率限制（用于敏感操作）
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 最多 5 次请求
  keyGenerator,
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// 认证相关的速率限制
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 10, // 最多 10 次登录尝试
  keyGenerator,
  handler: (req: Request, res: Response): void => {
    const clientIP = req.ip || 'unknown';
    
    logger.warn('Auth rate limit exceeded', {
      ip: clientIP,
      path: req.path,
      method: req.method
    });

    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.ceil(15 * 60) // 15 minutes
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API 速率限制
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 1000, // 每个用户每15分钟最多1000个API请求
  keyGenerator,
  skip,
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// 文件上传速率限制
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 小时
  max: 50, // 每小时最多50个文件上传
  keyGenerator,
  handler: (req: Request, res: Response): void => {
    const clientIP = req.ip || 'unknown';
    
    logger.warn('Upload rate limit exceeded', {
      ip: clientIP,
      path: req.path,
      method: req.method
    });

    res.status(429).json({
      error: 'Too many file uploads, please try again later.',
      retryAfter: Math.ceil(60 * 60) // 1 hour
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;