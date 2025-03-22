"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../Src/Utils/constant/enum");
const encryption_1 = require("../../Src/Utils/encryption");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    provider: {
        type: String,
        enum: Object.values(enum_1.providers),
        default: enum_1.providers.SYSTEM,
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.provider === enum_1.providers.SYSTEM) {
                    return !!value; // Password is required for SYSTEM (must be truthy)
                }
                return true; // If provider is Google, password is optional
            },
            message: "Password is required for SYSTEM provider",
        },
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
    },
    role: {
        type: String,
        enum: Object.values(enum_1.roles),
        default: enum_1.roles.USER,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    DOB: {
        type: String,
        default: () => new Date().toISOString(),
    },
    otpEmail: String,
    expiredDateOtp: Date,
});
//pre 
//hash Password
userSchema.pre("save", function (next) {
    // this >> doc
    if (this.isModified("password") && typeof this.password === "string") {
        this.password = (0, encryption_1.Hash)({ key: this.password, SALT_ROUNDS: process.env.SALT_ROUNDS });
    }
    next();
});
//model
exports.User = (0, mongoose_1.model)("User", userSchema);
