const Link = require('../../../models/Link');

module.exports = async (req, res) => {
    const link = await Link.findById(req.params.id);
    res.json(link);
};
