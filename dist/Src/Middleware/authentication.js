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
        const result = await (0, token_1.verifyToken)({
            token,
            secretKey: process.env.SECRET_TOKEN,
        }); // ⬅️ Await the promise
        // 🔹 Verify Token (Ensure `verifyToken` doesn't return null)
        if (!result || typeof result !== "object" || !("_id" in result)) {
            return next(new AppError_1.AppError("Invalid or expired token", 401));
        }
        // Check if user exists
        const authUser = await Database_1.User.findOne({ _id: result._id, isConfirmed: true });
        if (!authUser) {
            return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
        }
        console.log("✅ Authenticated User:", authUser);
        // Store authenticated user in request object
        req.authUser = authUser;
        next();
    }
    catch (error) {
        return next(new Error("Authentication failed"));
    }
};
exports.isAuthentication = isAuthentication;
