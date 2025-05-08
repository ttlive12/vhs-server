export const config = {
  port: process.env['PORT'] ?? 3000,
  db: {
    uri: process.env['MONGODB_URI'] ?? 'mongodb://root:df2nxvzf@dbconn.sealosgzg.site:38834/?directConnection=true',
    crawlerName: 'crawler',
    apiName: 'api',
  },
  api: {
    prefix: 'api',
  },
  serviceMode: process.env['SERVICE_MODE'],
  http: {
    retryConfig: {
      retries: Number.parseInt(process.env['HTTP_RETRY_CONFIG_RETRIES'] ?? '3', 10),
    },
    queueConfig: {
      concurrency: Number.parseInt(process.env['HTTP_QUEUE_CONFIG_CONCURRENCY'] ?? '4', 10),
    },
    timeout: Number.parseInt(process.env['HTTP_TIMEOUT'] ?? '10000', 10),
  },
};
