import { UserDocument } from "../../Database";
import { AppError } from "../Utils/AppError/AppError";
import { messages } from "../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../Utils/type"
import { AuthenticatedRequest } from "./authentication";

export const isAuthorization=(roles:string[] = [])=>{
    return (req: AuthenticatedRequest,res:AppResponse,next:AppNext)=>{
        console.log("🔹 User Role:", req.authUser?.role);
        console.log("🔹 Allowed Roles:", roles)
        if(!req.authUser || !roles.includes(req.authUser.role)){
            return next(new AppError(messages.user.notAuthorized,401))
        }
        next()
    }
}