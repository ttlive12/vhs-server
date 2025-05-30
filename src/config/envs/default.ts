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
  serviceMode: process.env['SERVICE_MODE'] ?? 'all',
  http: {
    retryConfig: {
      retries: Number.parseInt(process.env['HTTP_RETRY_CONFIG_RETRIES'] ?? '5', 10),
    },
    queueConfig: {
      concurrency: Number.parseInt(process.env['HTTP_QUEUE_CONFIG_CONCURRENCY'] ?? '4', 10),
    },
    timeout: Number.parseInt(process.env['HTTP_TIMEOUT'] ?? '10000', 10),
  },
  cb: {
    apiKey: process.env['CB_API_KEY'] ?? '241eeebbf0344cadbc9e1898ff7a068b',
    proxy: process.env['CB_PROXY'] ?? `http:s403:s403z@14.18.67.240:29100`,
  },
  proxy: {
    // eslint-disable-next-line sonarjs/no-clear-text-protocols
    url: process.env['PROXY_URL'] ?? 'http://s403:s403z@14.18.67.240:29100',
  },
};
