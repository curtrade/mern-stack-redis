const { validationResult } = require('express-validator');
const User = require('../../../models/User');
const { BadRequest, NotFound } = require('../../../modules/error-types');

module.exports = async (req, res) => {
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
};
