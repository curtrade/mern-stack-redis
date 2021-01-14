const Link = require('../../../models/Link');

module.exports = async (req, res) => {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
};
