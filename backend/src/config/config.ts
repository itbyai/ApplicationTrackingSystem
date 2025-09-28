import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  OPENAI_API_KEY: string;
  OPENAI_ORG_ID?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION: string;
  AWS_S3_BUCKET?: string;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  SESSION_SECRET: string;
  FRONTEND_URL: string;
  API_BASE_URL: string;
  LOG_LEVEL: string;
  LOG_FILE_PATH: string;
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_ORG_ID: process.env.OPENAI_ORG_ID,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || 'logs/app.log'
};

// 验证必需的环境变量
if (!config.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

if (!config.JWT_SECRET || config.JWT_SECRET === 'your-jwt-secret') {
  console.warn('Warning: Using default JWT_SECRET. Please set a secure JWT_SECRET in production.');
}

if (!config.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI features will not work.');
}

export default config;