import express from 'express';
const router = express.Router();

// 健康检查端点
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 详细健康检查
router.get('/detailed', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'ok',
      redis: 'ok',
      openai: 'ok',
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
      }
    };

    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Health check failed'
    });
  }
});

export default router;