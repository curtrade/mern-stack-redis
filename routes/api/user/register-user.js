const config = require('config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../../../models/User');
const { BadRequest } = require('../../../modules/error-types');

module.exports = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new BadRequest(errors.array()[0].msg, {
            errors: errors.array()
        });
    }

    const user = new User();

    await user.save();

    const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h'
    });

    res.json({ token, userId: user.id });
};
