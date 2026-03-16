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
        if (!token) {
            console.error("❌ Token is missing");
            return null;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("✅ Decoded Token:", decoded);
        if (!decoded || (!("_id" in decoded) && !("id" in decoded))) {
            console.error("❌ Token missing 'id' or '_id' field");
            return null;
        }
        // Ensure consistency: Always use "_id"
        decoded._id = decoded._id || decoded.id;
        delete decoded.id;
        return decoded;
    }
    catch (error) {
        console.error("❌ Token Verification Error:", error);
        return null;
    }
};
exports.verifyToken = verifyToken;
