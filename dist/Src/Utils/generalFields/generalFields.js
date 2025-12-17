"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.checkObjectId = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../constant/enum");
const mongoose_1 = require("mongoose");
//anther solution to check id
const checkObjectId = (value, helper) => {
    return mongoose_1.Types.ObjectId.isValid(value) ? true : helper.message("Invalid ObjectID");
};
exports.checkObjectId = checkObjectId;
exports.generalFields = {
    firstName: joi_1.default.string().max(15).min(3),
    lastName: joi_1.default.string().max(15).min(3),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ["com", "net"] },
    }),
    password: joi_1.default
        .string()
        .pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword: joi_1.default.string().valid(joi_1.default.ref("password")),
    role: joi_1.default.string().valid(...Object.values(enum_1.roles)),
    otpEmail: joi_1.default.string(),
    text: joi_1.default.string().max(200),
    DOB: joi_1.default.string(),
    objectId: joi_1.default.string().hex().length(24),
    profileId: joi_1.default.string().custom(exports.checkObjectId),
    refreshToken: joi_1.default.string(),
    idToken: joi_1.default.string(),
    phone: joi_1.default
        .string()
        .pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
    content: joi_1.default.string(),
    attachment: joi_1.default.array().items(joi_1.default.object({
        fieldname: joi_1.default.string().required(),
        originalname: joi_1.default.string().required(),
        encoding: joi_1.default.string().required(),
        mimetype: joi_1.default.string().required(),
        size: joi_1.default.number().required(),
        filename: joi_1.default.string().required(),
        destination: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
    })),
    image: joi_1.default.object({
        fieldname: joi_1.default.string().required(),
        originalname: joi_1.default.string().required(),
        encoding: joi_1.default.string().required(),
        mimetype: joi_1.default.string().required(),
        size: joi_1.default.number().positive().required(),
        filename: joi_1.default.string().required(),
        destination: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
    }),
    voice: joi_1.default.array().items(joi_1.default.object({
        fieldname: joi_1.default.string().required(),
        originalname: joi_1.default.string().required(),
        encoding: joi_1.default.string().required(),
        mimetype: joi_1.default.string().required(),
        size: joi_1.default.number().positive().required(),
        filename: joi_1.default.string().required(),
        destination: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
    })),
};
