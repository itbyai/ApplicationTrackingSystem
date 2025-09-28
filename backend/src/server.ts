import { app } from './app';
import config from './config/config';
import logger from './utils/logger';

const PORT = config.PORT || 3001;

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库连接
    logger.info('Starting server...');
    
    // 启动HTTP服务器
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`API URL: ${config.API_BASE_URL}`);
    });

    // 处理服务器错误
    server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

      switch (error.code) {
        case 'EACCES':
          logger.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // 优雅关闭处理
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // 强制关闭超时
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// 启动应用
startServer();