const joi = require("joi");

module.exports.listingSchema = joi.object(
    {
        listing : joi.object(
            {
                title : joi.string().required(),
                description : joi.string().required(),
                price : joi.number().required().min(0),
                location : joi.string().required(),
                country : joi.string().required(),
                image : joi.object(
                    {
                        filename : joi.string().allow("", null),
                        url : joi.string().allow("", null)
                    }
                )
            }
        ).required()
    }
)