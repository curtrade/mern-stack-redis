'use strict';
const ApiError = require('./api-error');

class BadRequest extends ApiError {
    constructor(...args) {
        super(...args);
        this._code = 400;
    }
}

module.exports = BadRequest;
