"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        const formattedMessage = Array.isArray(message) ? message.join(", ") : message;
        super(formattedMessage);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
