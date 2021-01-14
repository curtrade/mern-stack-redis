const Cache = require('./cache');

class redisCache extends Cache {
    constructor(instance, expiresInSeconds) {
        super('redis', instance);
        this.expiresInSeconds = expiresInSeconds;
    }

    get(key) {
        return this.instance.get(key);
    }

    set(key, value) {
        return this.instance.set(key, value, 'EX', this.expiresInSeconds);
    }
}

module.exports = redisCache;
