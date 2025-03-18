"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithGoogleVal = exports.changePasswordVal = exports.forgetPasswordVal = exports.refreshTokenVal = exports.signInVal = exports.confirmEmailVal = exports.signUpVal = void 0;
const enum_1 = require("../../Utils/constant/enum");
const generalFields_1 = require("../../Utils/generalFields/generalFields");
const joi_1 = __importDefault(require("joi"));
//sign up
exports.signUpVal = joi_1.default.object({
    firstName: generalFields_1.generalFields.firstName.required(),
    lastName: generalFields_1.generalFields.lastName.required(),
    email: generalFields_1.generalFields.email.required(),
    provider: joi_1.default.string()
        .valid(enum_1.providers.SYSTEM, enum_1.providers.GOOGLE),
    password: generalFields_1.generalFields.password.when("provider", {
        is: enum_1.providers.SYSTEM,
        then: joi_1.default.string().min(6).required(), // Password required for SYSTEM
        otherwise: joi_1.default.string().optional()
    }), // Not required for Google,
    cPassword: generalFields_1.generalFields.cPassword.required(),
    DOB: generalFields_1.generalFields.DOB,
    otpEmail: generalFields_1.generalFields.otpEmail,
    phone: generalFields_1.generalFields.phone.optional()
});
//confirm Email
exports.confirmEmailVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
    code: generalFields_1.generalFields.otpEmail.max(6).required()
}).required();
//sign in
exports.signInVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
    provider: joi_1.default.string()
        .valid(enum_1.providers.SYSTEM, enum_1.providers.GOOGLE),
    password: joi_1.default.alternatives().conditional("provider", {
        is: enum_1.providers.SYSTEM,
        then: generalFields_1.generalFields.password.required(),
        otherwise: joi_1.default.optional()
    }),
    phone: generalFields_1.generalFields.phone.optional()
});
//refresh token
exports.refreshTokenVal = joi_1.default.object({
    refreshToken: generalFields_1.generalFields.refreshToken.required()
}).required();
//forget password 
exports.forgetPasswordVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
});
//change password 
exports.changePasswordVal = joi_1.default.object({
    email: generalFields_1.generalFields.email.required(),
    password: generalFields_1.generalFields.password.required(),
    cPassword: generalFields_1.generalFields.cPassword.required(),
    otpEmail: generalFields_1.generalFields.otpEmail.required()
}).required();
//login with google
exports.loginWithGoogleVal = joi_1.default.object({
    idToken: generalFields_1.generalFields.idToken.required()
}).required();
