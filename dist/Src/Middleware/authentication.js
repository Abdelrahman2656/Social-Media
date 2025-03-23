"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthentication = void 0;
const Database_1 = require("../../Database");
const AppError_1 = require("../Utils/AppError/AppError");
const messages_1 = require("../Utils/constant/messages");
const token_1 = require("../Utils/Token/token");
const isAuthentication = async (req, res, next) => {
    try {
        // Get data from request headers
        const { authorization } = req.headers;
        if (!authorization?.startsWith("abdelrahman")) {
            return next(new Error("Invalid bearer token"));
        }
        const token = authorization.split(" ")[1]; // ["hambozo", "token"]
        // Check token
        const result = (0, token_1.verifyToken)({ token }); // payload >> email, fail >> error
        if (!("email" in result)) {
            return next(new Error("Invalid token"));
        }
        // Check if user exists
        const userExist = await Database_1.User.findOne({ email: result._id, isConfirmed: true });
        if (!userExist) {
            return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
        }
        // Store authenticated user in request object
        req.authUser = userExist;
        next();
    }
    catch (error) {
        return next(new Error("Authentication failed"));
    }
};
exports.isAuthentication = isAuthentication;
