'use strict';
const ExtraError = require('./extra-error');
class ApiError extends ExtraError {
    constructor(...args) {
        super(...args);
        this._code = 500;
    }

    getCode() {
        return this._code;
    }
}

module.exports = ApiError;
