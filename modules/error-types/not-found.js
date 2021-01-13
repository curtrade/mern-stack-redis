'use strict';
const ApiError = require('./api-error');

class NotFound extends ApiError {
    constructor(...args) {
        super(...args);
        this._code = 404;
    }
}

module.exports = NotFound;
