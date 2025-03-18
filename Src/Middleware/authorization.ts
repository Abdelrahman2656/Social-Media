import { AppError } from "../Utils/AppError/AppError";
import { messages } from "../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../Utils/type"
interface AuthenticatedRequest extends AppRequest {
    authUser?: {
      role: string; 
    };
  }
export const isAuthorization=(roles:string[] = [])=>{
    return (req: AuthenticatedRequest,res:AppResponse,next:AppNext)=>{
        if(!req.authUser || !roles.includes(req.authUser.role)){
            return next(new AppError(messages.user.notAuthorized,401))
        }
    }
}