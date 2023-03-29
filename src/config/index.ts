require('dotenv').config();

const appEnv = process.env.APP_ENV?.toLowerCase();

const configDefault = {
  basedir: __dirname + '/../../',
  isProd: ['prod', 'production'].includes(appEnv) ? true : false,
  isRunCmd: process.env.RUN_CMD === '1',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }
};

const config = Object.assign(configDefault, process.env);
export default config;
