const redirectRoutes = require('express').Router();
const handleApiError = require('../../modules/handle-api-error');

//instead of try...catch in every route
require('express-async-errors');

/**
 * @swagger
 * /l/[code]:
 *  get:
 *   tags:
 *   - redirect
 *   description: Redirect rule for short links
 *   parameters:
 *    - name: code
 *      description: short link subpart
 *      type: string
 *      required: true
 *   responses:
 *    302:
 *     description: Redirect to user's source link
 *    404:
 *     description: Link not found
 */
redirectRoutes.get('/:code', require('./redirect-link'));
redirectRoutes.use('*', handleApiError);

module.exports = redirectRoutes;
