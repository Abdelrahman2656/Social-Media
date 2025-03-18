"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthentication = void 0;
const Database_1 = require("../../Database");
const AppError_1 = require("../Utils/AppError/AppError");
const messages_1 = require("../Utils/constant/messages");
const token_1 = require("../Utils/Token/token");
const isAuthentication = () => {
    return async (req, res, next) => {
        try {
            // get token 
            let { authorization } = req.headers;
            if (!authorization?.startsWith('abdelrahman')) {
                return next(new AppError_1.AppError('Invalid Bearer Token', 401));
            }
            let token = authorization.split(' ')[1];
            if (!token) {
                return next(new AppError_1.AppError('Token Required', 401));
            }
            //decode token 
            const payload = (0, token_1.verifyToken)({ token });
            if (typeof payload === "string" || "message" in payload) {
                return next(new AppError_1.AppError(payload.message, 401));
            }
            //userExist 
            let authUser = await Database_1.User.findOne({ _id: payload._id, isConfirmed: true });
            if (!authUser) {
                return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
            }
            req.authUser = authUser;
        }
        catch (error) {
            return next(new AppError_1.AppError("Authentication failed", 500));
        }
    };
};
exports.isAuthentication = isAuthentication;
