"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const AppError_1 = require("../Utils/AppError/AppError");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query };
        if (req.file) {
            data.attachment = req.file;
        }
        else if (Array.isArray(req.files)) {
            data.attachment = req.files;
        }
        else if (req.files && typeof req.files === "object") {
            for (const key in req.files) {
                const field = req.files[key];
                if (Array.isArray(field) && field.length > 0) {
                    data[key] = field[0]; // ✅ نمرر أول ملف بس
                }
            }
        }
        let { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errMSG = error.details.map((err) => err.message);
            return next(new AppError_1.AppError(errMSG.join(", "), 400));
        }
        next();
    };
};
exports.isValid = isValid;
