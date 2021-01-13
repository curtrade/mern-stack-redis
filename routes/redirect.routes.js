const config = require('config');
const { Router } = require('express');
const Link = require('../models/Link');
const redis = require('../redis-env');
const router = Router();
const { NotFound, BadRequest } = require('../modules/error-types');

//instead of try...catch in every route
require('express-async-errors');

/**
 * @swagger
 * /l/[code]:
 *  get:
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
router.get('/:code', async (req, res) => {
    const code = req.params.code;
    if (!code) {
        throw new BadRequest();
    }

    const sourceLink = await redis.get(code);

    if (sourceLink) {
        return res.redirect(sourceLink);
    }

    const link = await Link.findOne({ code });

    if (link) {
        await redis.set(
            code,
            link.from,
            'EX',
            config.get('linkCacheTimeoutSeconds')
        );
        return res.redirect(link.from);
    }

    throw new NotFound('Ссылка не найдена');
});

module.exports = router;
