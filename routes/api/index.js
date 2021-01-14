const apiRoutes = require('express').Router();
const handleApiError = require('../../modules/handle-api-error');

apiRoutes.use('/user', require('./user'));
apiRoutes.use('/link', require('./link'));
apiRoutes.use('*', handleApiError);

module.exports = apiRoutes;
