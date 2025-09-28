import winston from 'winston';
import path from 'path';
import config from '../config/config';

// 创建日志目录
const logDir = path.dirname(config.LOG_FILE_PATH);

// 自定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

// 控制台格式
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// 创建Winston logger实例
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'job-tracker-api' },
  transports: [
    // 错误日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 所有日志文件
    new winston.transports.File({
      filename: config.LOG_FILE_PATH,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 开发环境添加控制台输出
if (config.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// 生产环境错误处理
if (config.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    })
  );
}

// 扩展logger方法
export const logRequest = (req: any, res: any, next: any) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
};

export const logError = (error: Error, context?: string) => {
  logger.error('Application error', {
    error: error.message,
    stack: error.stack,
    context,
  });
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export default logger;