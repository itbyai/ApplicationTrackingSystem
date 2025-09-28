import { CorsOptions } from 'cors';
import config from './config';

// CORS配置
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // 允许的源列表
    const allowedOrigins = [
      config.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];

    // 开发环境允许所有源
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push('*');
    }

    // 检查请求源是否被允许
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Per-Page',
    'X-Current-Page'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // 支持legacy浏览器
  maxAge: 86400 // 24小时预检请求缓存
};

export default corsConfig;