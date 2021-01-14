const config = require('config');
const redisClient = require('./redis-env');
const Cache = require('./modules/cache/redis-cache');

const linkCache = new Cache(redisClient, config.get('linkCacheTimeoutSeconds'));

module.exports = linkCache;
