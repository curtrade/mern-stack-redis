const config = require('config')
let redis = require('async-redis')
const CustomLogger = require('./modules/custom-logger')

const logger = new CustomLogger('redis-env.js')

const port = config.get('redisPort')
const host = config.get('redisHost')

const client = redis.createClient(port, host)

client.on('error', function (error) {
    logger.error('error', error)
})

module.exports = client
