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
exports.cloudUpload = void 0;
const AppError_1 = require("../AppError/AppError");
const multer_1 = __importStar(require("multer"));
const cloudUpload = (allowType = []) => {
    //storage 
    const storage = (0, multer_1.diskStorage)({});
    //file filter
    const fileFilter = (req, file, cb) => {
        console.log(file);
        if (allowType.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new AppError_1.AppError("invalid file format", 400));
    };
    //return
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: 100 * 1024 * 1024,
        }
    });
};
exports.cloudUpload = cloudUpload;
