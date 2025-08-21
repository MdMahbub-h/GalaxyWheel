const Joi = require("joi");
const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
    segment_1: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_2: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_3: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_4: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_5: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_6: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_7: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_8: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_9: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_10: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_11: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    segment_12: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    eye_bonus_no: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    eye_bonus_half: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    eye_bonus_full: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
});

SettingsSchema.method("toJSON", function () {
    const object = this.toObject();
    const id = object._id.toString();
    const { _id, __v, ...data } = object;
    return { ...data, id };
});

const validate = (data) => {
    const schema = Joi.object({
        segment_1: Joi.number().required().min(0).max(100),
        segment_2: Joi.number().required().min(0).max(100),
        segment_3: Joi.number().required().min(0).max(100),
        segment_4: Joi.number().required().min(0).max(100),
        segment_5: Joi.number().required().min(0).max(100),
        segment_6: Joi.number().required().min(0).max(100),
        segment_7: Joi.number().required().min(0).max(100),
        segment_8: Joi.number().required().min(0).max(100),
        segment_9: Joi.number().required().min(0).max(100),
        segment_10: Joi.number().required().min(0).max(100),
        segment_11: Joi.number().required().min(0).max(100),
        segment_12: Joi.number().required().min(0).max(100),
        eye_bonus_no: Joi.number().required().min(0).max(100),
        eye_bonus_half: Joi.number().required().min(0).max(100),
        eye_bonus_full: Joi.number().required().min(0).max(100),
    });
    return schema.validate(data);
};

const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = { Settings, validate };
