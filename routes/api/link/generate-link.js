const config = require('config');
const { validationResult } = require('express-validator');
const shortid = require('shortid');
const cache = require('../../../link-cache-env');
const Link = require('../../../models/Link');
const User = require('../../../models/User');
const { NotFound, BadRequest } = require('../../../modules/error-types');

module.exports = async (req, res) => {
    const baseUrl = config.get('baseUrl');
    const redirectPrefix = config.get('redirectPrefix');
    const { from } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new BadRequest(errors.array()[0].msg, {
            errors: errors.array()
        });
    }

    const user = await User.findById(req.user.userId);
    let code;

    if (!user) {
        throw new NotFound('Сессия не найдена. Нажмите "Очистить сессию" для того, чтобы создалась новая');
    }

    if (user.subpart) {
        const linksCount = await Link.countDocuments({
            owner: req.user.userId
        });
        code = user.subpart + '-' + (linksCount + 1);
    } else {
        code = shortid.generate();
    }

    const existing = await Link.findOne({ from, owner: req.user.userId });
    if (existing) {
        await cache.set(code, existing.from);
        return res.json({ link: existing });
    }
    let to = baseUrl + '/' + redirectPrefix + '/' + code;

    const link = new Link({ code, to, from, owner: req.user.userId });

    await link.save();
    await cache.set(code, link.from);

    res.status(201).json({ link });
};
