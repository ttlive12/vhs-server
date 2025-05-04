export const config = {
  port: process.env['PORT'] ?? 3000,
  db: {
    uri: process.env['MONGODB_URI'] ?? 'mongodb://root:df2nxvzf@dbconn.sealosgzg.site:38834/?directConnection=true',
  },
  api: {
    prefix: 'api',
  },
  serviceMode: process.env['SERVICE_MODE'],
};
