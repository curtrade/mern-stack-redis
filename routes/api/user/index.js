const { Router } = require('express');
const config = require('config');
const auth = require('../../../middleware/auth.middleware');
const { body } = require('express-validator');
const urlencode = require('urlencode');
const localRoutes = Router();

//instead of try...catch in every route
require('express-async-errors');

// /api/user/register
/**
 * @swagger
 * /api/user/register:
 *  post:
 *   tags:
 *   - user
 *   description: Use to register new user
 *   parameters:
 *    - name: action
 *      enum: ['create-user']
 *      required: true
 *
 *   responses:
 *    200:
 *     description: User created
 *    400:
 *     description: Bad request
 */
localRoutes.post(
    '/register',
    body('action').custom((value) => {
        return value !== 'create-user' ? Promise.reject('Некорректное действие') : Promise.resolve();
    }),
    require('./register-user')
);

// /api/user/subpart
/**
 * @swagger
 * /api/user/subpart:
 *  put:
 *   tags:
 *   - user
 *   description: Use to update user's subpart (JWT Bearer auth required)
 *   parameters:
 *    - name: subpart
 *      description: Subpart to be added to new user's links
 *      type: string
 *      required: true
 *
 *   responses:
 *    200:
 *     description: Subpart updated
 *    400:
 *     description: Bad request
 *    404:
 *     description: User not found
 */
localRoutes.put(
    '/subpart',
    [
        auth,
        body('subpart', 'Subpart содержит недопустимые символы').custom((subpart) => {
            /* eslint-disable */
            return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\':<>\?]/g.test(subpart);
            /* eslint-enable */
        }),
        body('subpart').customSanitizer((subpart) => {
            return urlencode(subpart);
        }),
        body('subpart', 'Subpart не может быть слишком длинным').custom((subpart) => {
            return subpart.length <= config.get('subpartMaxLength');
        })
    ],
    require('./update-subpart')
);

module.exports = localRoutes;
