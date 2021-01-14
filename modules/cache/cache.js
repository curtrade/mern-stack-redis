class Cache {
    constructor(instanceType, instance) {
        this.instanceType = instanceType;
        this.instance = instance;
    }
    get(/*key*/) {
        throw new Error('Method get not defined for instance: ' + this.instanceType);
    }
    set(/*key, value*/) {
        throw new Error('Method set not defined for instance: ' + this.instanceType);
    }
}

module.exports = Cache;
