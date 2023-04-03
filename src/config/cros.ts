import config from '../config';

const sitesEnv = {
  dev: ['http://localhost:3000', '^(https://([^.]*.)?oraidex.io)$'],
  prod: ['^(https://([^.]*.)?oraidex.io)$'],
};

const CORS_SITE = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  origin: '*' as any,
};
let sites: string[] = [];

if (config.CORS_ORIGINS) {
  sites = config.CORS_ORIGINS.split(',');
}
if (sites.length === 0) {
  if (config.isProd) {
    sites = sitesEnv.prod;
  } else {
    sites = sitesEnv.dev;
  }
}
const matchRegHost = (sites: string[], host: string): boolean => {
  for (const site of sites) {
    if (site === '*') {
      return true;
    }
    const r = new RegExp(site);
    if (r.test(host)) {
      return true;
    }
  }
  return false;
};

CORS_SITE.origin = function (origin: string, callback: any) {
  if (!origin || sites.includes(origin) || matchRegHost(sites, origin)) {
    callback(null, true);
  } else {
    console.error('CORS', origin);
    callback(new Error('Not allowed by CORS'));
  }
};
export default CORS_SITE;
