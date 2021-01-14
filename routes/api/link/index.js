const localRoutes = require('express').Router();
const { body } = require('express-validator');
const auth = require('../../../middleware/auth.middleware');
const checkUrlValid = require('../../../modules/check-url-valid');

//instead of try...catch in every route
require('express-async-errors');

/**
 * @swagger
 * /api/link/generate:
 *  post:
 *   tags:
 *   - link
 *   description: Use to generate new short link (JWT Bearer auth required)
 *   parameters:
 *    - name: from
 *      description: Source user's link
 *      type: string
 *      required: true
 *
 *   responses:
 *    201:
 *     description: Short link created
 *    400:
 *     description: Bad request
 *    404:
 *     description: User not found
 */
localRoutes.post(
    '/generate',
    [
        auth,
        body('from', 'URL не задан').custom((from) => {
            return from && from.length > 0;
        }),
        body('from', 'URL некорректный').custom((from) => {
            return checkUrlValid(from);
        })
    ],
    require('./generate-link.js')
);

/**
 * @swagger
 * /api/link:
 *  get:
 *   tags:
 *   - link
 *   description: Use to get all user's links (JWT Bearer auth required)
 *   parameters:
 *   responses:
 *    200:
 *     description: links returned
 */
localRoutes.get('/', auth, require('./get-links.js'));

/**
 * @swagger
 * /api/link/[id]:
 *  get:
 *   tags:
 *   - link
 *   description: Use to get user's link by id (JWT Bearer auth required)
 *   parameters:
 *   - name: id
 *     description: link id
 *     required: true
 *     type: string
 *   responses:
 *    200:
 *     description: link returned
 */
localRoutes.get('/:id', auth, require('./get-link.js'));

module.exports = localRoutes;
