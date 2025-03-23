"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorization = void 0;
const AppError_1 = require("../Utils/AppError/AppError");
const messages_1 = require("../Utils/constant/messages");
const isAuthorization = (roles = []) => {
    return (req, res, next) => {
        console.log("🔹 User Role:", req.authUser?.role);
        console.log("🔹 Allowed Roles:", roles);
        if (!req.authUser || !roles.includes(req.authUser.role)) {
            return next(new AppError_1.AppError(messages_1.messages.user.notAuthorized, 401));
        }
        next();
    };
};
exports.isAuthorization = isAuthorization;
