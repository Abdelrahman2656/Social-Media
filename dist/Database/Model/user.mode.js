"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../Src/Utils/constant/enum");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider == enum_1.provider.SYSTEM ? true : false;
        },
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(enum_1.roles),
        default: enum_1.roles.USER
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    DOB: {
        type: String,
        default: () => new Date().toISOString()
    },
    provider: {
        type: String,
        enum: Object.values(enum_1.provider),
        default: enum_1.provider.SYSTEM
    },
    otpEmail: String,
    expiredDateOtp: Date
});
//model
exports.User = (0, mongoose_1.model)('User', userSchema);
