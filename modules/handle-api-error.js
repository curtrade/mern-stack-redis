const CustomLogger = require('./custom-logger');
const logger = new CustomLogger('./handle-api-error.js');
const { ApiError } = require('./error-types');

const SYSTEM_ERROR_HTTP_CODE = 500;
const SYSTEM_ERROR_MESSAGE = 'Что-то пошло не так, попробуйте снова';

module.exports = (err, req, res, next) => {
    if (err) {
        if (err instanceof ApiError) {
            res.status(err.getCode()).json({
                message: err.message,
                ...err.getParams()
            });
            logger.error('api error', {
                code: err.getCode(),
                params: err.getParams(),
                message: err.message,
                stack: err.stack
            });
        } else {
            res.status(SYSTEM_ERROR_HTTP_CODE).json({
                message: SYSTEM_ERROR_MESSAGE
            });
            logger.error('error', {
                message: err.message,
                stack: err.stack
            });
        }
    }
    next(err);
};
