"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = exports.asyncHandler = void 0;
const Cloud_Upload_1 = require("../Utils/Cloud-Upload");
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err);
        });
    };
};
exports.asyncHandler = asyncHandler;
const globalErrorHandling = async (err, req, res, next) => {
    if (Array.isArray(req.failImages) && req.failImages.length > 0) {
        for (const public_id of req.failImages) {
            await (0, Cloud_Upload_1.deleteCloudImage)(public_id);
        }
    }
    if (process.env.MODE == 'DEV') {
        return res.status(err.statusCode || 500).json({ message: err.message, success: false, stack: err.stack });
    }
    return res.status(err.statusCode || 500).json({ message: err.message, success: false });
};
exports.globalErrorHandling = globalErrorHandling;
