const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    subpart: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    links: [{ type: Types.ObjectId, ref: 'Link' }]
});

module.exports = model('User', schema);
