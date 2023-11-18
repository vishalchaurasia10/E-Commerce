const moongose = require('mongoose');

const appliedPromoCodeSchema = new moongose.Schema({
    userId: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    appliedCodes: [
        {
            code: {
                type: String,
                required: true,
            },
            usageCount: {
                type: Number,
                default: 1, // Default to 1, as it's the first time the code is applied
            },
        },
    ],
});

const AppliedPromoCode = moongose.model('AppliedPromoCode', appliedPromoCodeSchema);

module.exports = AppliedPromoCode;
