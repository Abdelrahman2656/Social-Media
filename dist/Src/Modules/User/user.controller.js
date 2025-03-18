"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../Middleware/asyncHandler");
const validation_1 = require("../../Middleware/validation");
const US = __importStar(require("./user.service"));
const VA = __importStar(require("./user.validation"));
const userRouter = (0, express_1.Router)();
// sign up
userRouter.post('/signup', (0, validation_1.isValid)(VA.signUpVal), (0, asyncHandler_1.asyncHandler)(US.signUp));
// confirm email 
userRouter.patch('/confirm-email', (0, validation_1.isValid)(VA.confirmEmailVal), (0, asyncHandler_1.asyncHandler)(US.ConfirmEmail));
//activate-account
userRouter.get('/activate-account/:token', (0, asyncHandler_1.asyncHandler)(US.activateAccount));
//refresh-Token
userRouter.post('/refresh-token', (0, validation_1.isValid)(VA.refreshTokenVal), (0, asyncHandler_1.asyncHandler)(US.refreshToken));
//login
userRouter.post('/signin', (0, validation_1.isValid)(VA.signInVal), (0, asyncHandler_1.asyncHandler)(US.login));
//login with google
userRouter.post('/google-login', (0, validation_1.isValid)(VA.loginWithGoogleVal), (0, asyncHandler_1.asyncHandler)(US.loginWithGoogle));
//forget password
userRouter.post('/forget-password', (0, validation_1.isValid)(VA.forgetPasswordVal), (0, asyncHandler_1.asyncHandler)(US.forgetPassword));
//change password 
userRouter.put('/change-password', (0, validation_1.isValid)(VA.changePasswordVal), (0, asyncHandler_1.asyncHandler)(US.changePassword));
exports.default = userRouter;
