"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthentication = void 0;
const Database_1 = require("../../Database");
const AppError_1 = require("../Utils/AppError/AppError");
const messages_1 = require("../Utils/constant/messages");
const token_1 = require("../Utils/Token/token");
// interface AuthenticatedRequest extends AppRequest {
//     authUser?: any; 
//   }
// export const isAuthentication =()=>{
//     return async(req:AuthenticatedRequest,res:AppResponse, next:AppNext)=>{
//        try{
//   // get token 
// let{authorization} = req.headers
// if (!authorization?.startsWith("abdelrahman")) {
//   return next(new AppError('Invalid Bearer Token',401))
// }
// let token = authorization.split(" ")[1]
//   if (!token){
//     return next(new AppError('Token Required',401))
//   }
//   //decode token 
//   let payload = verifyToken({token})
//   if (typeof payload === "string" || "message" in payload) {
//     return next(new AppError((payload as { message: string }).message, 401));
//   }
//   console.log("Decoded Payload:", payload); 
//         // 🔹 التحقق من صحة _id
//         if (!payload._id || typeof payload._id !== "string") {
//           return next(new AppError("Invalid User ID in Token", 400));
//         }
//   //userExist 
//   if (!mongoose.Types.ObjectId.isValid(payload._id)) {
//     return next(new AppError("Invalid User ID in Token", 400));
//   }
//   const userId = new mongoose.Types.ObjectId(payload._id);
//   // 🔹 البحث عن المستخدم في قاعدة البيانات
//   let authUser = await User.findOne({ _id: userId, isConfirmed: true });
//   if(!authUser){
//     return next(new AppError(messages.user.notFound,404))
//   }
//   req.authUser = authUser
//   next()
//        }catch(error){
//         return next(new AppError("Authentication failed", 500));
//        }
//     }
// }
const isAuthentication = async (req, res, next) => {
    try {
        // Get data from request headers
        const { authorization } = req.headers;
        if (!authorization?.startsWith("abdelrahman")) {
            return next(new Error("Invalid bearer token"));
        }
        const token = authorization.split(" ")[1]; // ["hambozo", "token"]
        // Check token
        const result = await (0, token_1.verifyToken)({ token, secretKey: process.env.SECRET_TOKEN }); // ⬅️ Await the promise
        // 🔹 Verify Token (Ensure `verifyToken` doesn't return null)
        if (!result) {
            return next(new AppError_1.AppError("Invalid or expired token", 401)); // ✅ Properly handle failure
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
