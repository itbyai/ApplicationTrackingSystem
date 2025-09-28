import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ApiError extends Error {
  statusCode: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// HTTP错误状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// 开发环境错误响应
const sendErrorDev = (err: ApiError, res: Response) => {
  res.status(err.statusCode).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// 生产环境错误响应
const sendErrorProd = (err: ApiError, res: Response) => {
  // 操作错误：发送错误消息给客户端
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // 编程错误：不泄露错误详情
    logger.error('Unexpected error:', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    });
  }
};

// Prisma错误处理
const handlePrismaError = (err: any): AppError => {
  if (err.code === 'P2002') {
    // 唯一约束违反
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`${field} already exists`, HTTP_STATUS.CONFLICT);
  }
  
  if (err.code === 'P2025') {
    // 记录未找到
    return new AppError('Record not found', HTTP_STATUS.NOT_FOUND);
  }
  
  if (err.code === 'P2003') {
    // 外键约束违反
    return new AppError('Referenced record does not exist', HTTP_STATUS.BAD_REQUEST);
  }

  if (err.code === 'P2014') {
    // 关联记录冲突
    return new AppError('The change you are trying to make would violate the required relation', HTTP_STATUS.BAD_REQUEST);
  }

  return new AppError('Database error', HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

// JWT错误处理
const handleJWTError = (): AppError => 
  new AppError('Invalid token. Please log in again!', HTTP_STATUS.UNAUTHORIZED);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired! Please log in again.', HTTP_STATUS.UNAUTHORIZED);

// 验证错误处理
const handleValidationError = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, HTTP_STATUS.BAD_REQUEST);
};

// 全局错误处理中间件
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // 记录错误日志
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Prisma错误
  if (err.code && err.code.startsWith('P')) {
    error = handlePrismaError(err);
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // Multer错误（文件上传）
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large', HTTP_STATUS.BAD_REQUEST);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new AppError('Too many files', HTTP_STATUS.BAD_REQUEST);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new AppError('Unexpected field', HTTP_STATUS.BAD_REQUEST);
  }

  // Express验证错误
  if (err.type === 'entity.parse.failed') {
    error = new AppError('Invalid JSON', HTTP_STATUS.BAD_REQUEST);
  }

  // 设置默认错误
  if (!error.statusCode) {
    error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    error.isOperational = false;
  }

  // 发送错误响应
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404处理中间件
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND);
  next(err);
};

// 异步错误捕获包装器
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};