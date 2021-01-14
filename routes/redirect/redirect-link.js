const Link = require('../../models/Link');
const cache = require('../../link-cache-env');
const { NotFound, BadRequest } = require('../../modules/error-types');

module.exports = async (req, res) => {
    const code = req.params.code;
    if (!code) {
        throw new BadRequest();
    }

    const sourceLink = await cache.get(code);

    if (sourceLink) {
        return res.redirect(sourceLink);
    }

    const link = await Link.findOne({ code });

    if (link) {
        await cache.set(code, link.from);
        return res.redirect(link.from);
    }

    throw new NotFound('Ссылка не найдена');
};
