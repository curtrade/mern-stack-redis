const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const urlencode = require('urlencode');
const router = Router();
const { BadRequest, NotFound } = require('../modules/error-types');

//instead of try...catch in every route
require('express-async-errors');

// /api/user/register
/**
 * @swagger
 * /user/register:
 *  post:
 *   description: Use to register new user
 *   parameters:
 *    - name: action
 *      enum: ["create-user"]
 *      required: true
 *
 *   responses:
 *    200:
 *     description: User created
 *    400:
 *     description: Bad request
 */
router.post(
    '/register',
    body('action').custom((value) => {
        return value !== 'create-user'
            ? Promise.reject('Некорректное действие')
            : Promise.resolve();
    }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new BadRequest(errors.array()[0].msg, {
                errors: errors.array()
            });
        }

        const user = new User();

        await user.save();

        // prettier-ignore
        const token = jwt.sign(
          { userId: user.id },
          config.get('jwtSecret'),
          { expiresIn: '1h' }
        )

        res.json({ token, userId: user.id });
    }
);

// /api/user/subpart
/**
 * @swagger
 * /user/subpart:
 *  put:
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
router.put(
    '/subpart',
    [
        auth,
        body('subpart', 'Subpart содержит недопустимые символы').custom(
            (subpart) => {
                /* eslint-disable */
                return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(subpart);
                /* eslint-enable */
            }
        ),
        body('subpart').customSanitizer((subpart) => {
            return urlencode(subpart);
        }),
        body('subpart', 'Subpart не может быть слишком длинным').custom(
            (subpart) => {
                return subpart.length <= config.get('subpartMaxLength');
            }
        )
    ],
    async (req, res) => {
        const { subpart } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new BadRequest(errors.array()[0].msg, {
                errors: errors.array()
            });
        }

        if (!subpart && subpart !== '') {
            throw new BadRequest('Не задан subpart');
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            throw new NotFound('Пользователь не найден');
        }

        if (user.subpart === subpart) {
            throw new BadRequest('Вы уже сохранили этот subpart');
        }

        const subpartCount = await User.countDocuments({
            subpart
        });

        if (subpartCount > 0) {
            throw new BadRequest('Subpart занят другим пользователем ');
        }

        user.subpart = subpart;
        await user.save();

        res.json({ message: 'Subpart сохранен count' });
    }
);

module.exports = router;
