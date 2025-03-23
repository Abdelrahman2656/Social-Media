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
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        console.error("❌ Token Verification Failed:", error.message);
        return null; // ✅ Return null instead of an error object
    }
};
exports.verifyToken = verifyToken;
// export const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN as string }: VerifyTokenParams): JwtPayload | null => {
//     try {
//         if (!token) {
//             console.error("❌ Token is missing");
//             return null;
//         }
//         const decoded = jwt.verify(token, secretKey) as JwtPayload;
//         console.log("✅ Decoded Token:", decoded);
//         if (!decoded || (!("_id" in decoded) && !("id" in decoded))) {
//           console.error("❌ Token missing 'id' or '_id' field");
//           return null;
//       }
//       // Ensure consistency: Always use "_id"
//       decoded._id = decoded._id || decoded.id;
//       delete decoded.id;
//       return decoded; 
//     } catch (error) {
//         console.error("❌ Token Verification Error:", error);
//         return null;  // Return null instead of throwing an error
//     }
// };
// export const verifyToken = ({
//   token,
//   secretKey = process.env.SECRET_TOKEN as string,
// }: VerifyTokenParams): CustomJwtPayload | null => {
//   try {
//     if (!token) {
//       console.error("❌ Token is missing");
//       return null;
//     }
//     // Verify the token
//     let decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
//     console.log("✅ Decoded Token:", decoded);
//     // Ensure `_id` exists in the payload
//     if (!decoded || !decoded._id) {
//       console.error("❌ Token missing '_id' field");
//       return null;
//     }
//     return decoded;
//   } catch (error: any) {
//     if (error.name === "TokenExpiredError") {
//       console.error("❌ Token has expired");
//     } else if (error.name === "JsonWebTokenError") {
//       console.error("❌ Invalid token signature");
//     } else {
//       console.error("❌ Token Verification Error:", error.message);
//     }
//     return null;
//   }
// };
