const config = require('config');
const express = require('express');
const routes = express.Router();
const path = require('path');

const NOT_FOUND_ERROR_HTTP_CODE = 404;
const NOT_FOUND_ERROR_MESSAGE = 'Ресурс не найден';

routes.use('/api', require('./api'));
routes.use('/' + config.get('redirectPrefix'), require('./redirect'));

if (process.env.NODE_ENV === 'production') {
    routes.use('/', express.static(path.join(__dirname, 'client', 'build')));
    routes.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

routes.use('*', (req, res, next) => {
    res.status(NOT_FOUND_ERROR_HTTP_CODE).json({
        message: NOT_FOUND_ERROR_MESSAGE
    });
    next();
});

module.exports = routes;
