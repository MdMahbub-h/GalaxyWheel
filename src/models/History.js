const Joi = require("joi");
const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
    result: {
        type: String,
        required: true,
    },
    bonus_result: {
        type: String,
        default: "",
    },
    odds: {
        type: String,
        required: true,
    },
    date_time: {
        type: Date,
        default: Date.now(),
    },
});

HistorySchema.method("toJSON", function () {
    const object = this.toObject();
    const id = object._id.toString();
    const { _id, __v, ...data } = object;
    return { ...data, id };
});

const validate = (data) => {
    const schema = Joi.object({
        result: Joi.string().required(),
        bonus_result: Joi.string().allow(""),
        odds: Joi.string().required(),
        date_time: Joi.date().default(Date.now()),
    });
    return schema.validate(data);
};

const History = mongoose.model("History", HistorySchema);

module.exports = { History, validate };
