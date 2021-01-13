'use strict';

class ExtraError extends Error {
    constructor(message, params) {
        super(message);
        if (params && typeof params === 'object') {
            this._params = params;
        } else {
            this._params = {};
        }
    }
    getParams() {
        return this._params;
    }
}

module.exports = ExtraError;
