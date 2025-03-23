"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorization = void 0;
const AppError_1 = require("../Utils/AppError/AppError");
const messages_1 = require("../Utils/constant/messages");
// export const isAuthorization=(roles:string[] = [])=>{
//     return (req: AuthenticatedRequest,res:AppResponse,next:AppNext)=>{
//         console.log("🔹 User Role:", req.authUser?.role);
//         console.log("🔹 Allowed Roles:", roles)
//         if(!req.authUser || !roles.includes(req.authUser.role)){
//             return next(new AppError(messages.user.notAuthorized,401))
//         }
//         next()
//     }
// }
const isAuthorization = (roles = []) => {
    return (req, res, next) => {
        if (!req.authUser) {
            console.warn("⚠️ Authorization Failed: No authenticated user found.");
            return next(new AppError_1.AppError(messages_1.messages.user.notAuthorized, 401));
        }
        console.log("🔹 User Role:", req.authUser.role);
        console.log("🔹 Allowed Roles:", roles);
        // If no specific roles are required, allow access
        if (roles.length === 0) {
            console.log("✅ No specific roles required. Access granted.");
            return next();
        }
        // Check if user's role is in the allowed list
        if (!roles.includes(req.authUser.role)) {
            console.warn(`⛔ Access Denied: User role '${req.authUser.role}' is not allowed.`);
            return next(new AppError_1.AppError(messages_1.messages.user.notAuthorized, 403));
        }
        console.log("✅ Access Granted");
        next();
    };
};
exports.isAuthorization = isAuthorization;
