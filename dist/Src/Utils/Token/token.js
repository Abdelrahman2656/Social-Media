"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = ({ payload, secretKey = process.env.SECRET_TOKEN, options }) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateToken = generateToken;
const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN }) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("✅ Decoded Token:", decoded); // 🔍 تحقق من البيانات بعد فك التشفير
        return decoded;
    }
    catch (error) {
        console.error("❌ Token Verification Error:", error);
        return { message: error.message };
    }
};
exports.verifyToken = verifyToken;
