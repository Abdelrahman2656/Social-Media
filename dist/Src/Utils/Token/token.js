"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export const generateToken =({payload , secretKey = process.env.SECRET_TOKEN as string,options}:GenerateToken):string=>{
// return jwt.sign(payload,secretKey,options)
// }
const generateToken = ({ payload, secretKey = process.env.SECRET_TOKEN, options }) => {
    // if (!payload._id) {
    //     throw new Error("❌ Missing _id in Token Payload");
    // }
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateToken = generateToken;
// export const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN as string }: VerifyToken): JwtPayload | { message: string } => {
//     try {
//       const decoded = jwt.verify(token, secretKey) as JwtPayload;
//       console.log("✅ Decoded Token:", decoded); // 🔍 تحقق من البيانات بعد فك التشفير
//       return decoded;
//     } catch (error) {
//       console.error("❌ Token Verification Error:", error);
//       return { message: (error as Error).message };
//     }
//   };
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
