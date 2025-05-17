# VHS-Server

- node版本：22

NestJS选型：
1. 完备的TS支持
2. 生态丰富，可兼容大多数express生态

性能优化：
1. CacheManager
2. compression压缩
3. Fastify API（自动开启KeepAlive长链接）

业务优化：
1. 模块化，动态加载模块
2. 降级请求队列保证数据量级
3. 爬虫使用p-queue实现并发请求队列控制
4. 爬虫重试机制，降级使用反爬API机制