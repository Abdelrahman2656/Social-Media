"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err);
        });
    };
};
exports.asyncHandler = asyncHandler;
const globalErrorHandling = async (err, req, res, next) => {
    if (process.env.MODE == 'DEV') {
        return res.status(err.statusCode || 500).json({ message: err.message, success: false, stack: err.stack });
    }
    return res.status(err.statusCode || 500).json({ message: err.message, success: false });
};
exports.globalErrorHandling = globalErrorHandling;
