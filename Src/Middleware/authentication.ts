import mongoose from "mongoose";
import { User } from "../../Database";
import { AppError } from "../Utils/AppError/AppError";
import { messages } from "../Utils/constant/messages";
import { verifyToken } from "../Utils/Token/token"
import { AppNext, AppRequest, AppResponse } from "../Utils/type"
import { JwtPayload } from "jsonwebtoken";


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

interface AuthenticatedRequest extends AppRequest {
  authUser?: any; // Consider replacing `any` with a proper user type
}

export const isAuthentication = 
  async (req: AuthenticatedRequest, res: AppResponse, next: AppNext) => {
      try {
          // Get data from request headers
          const { authorization } = req.headers;

          if (!authorization?.startsWith("abdelrahman")) {
              return next(new Error("Invalid bearer token"));
          }

          const token = authorization.split(" ")[1]; // ["hambozo", "token"]

          // Check token
          const result = verifyToken({token}); // payload >> email, fail >> error
          if (!("email" in result)) {
            return next(new Error("Invalid token"));
        }

          // Check if user exists
          const userExist = await User.findOne({ email: result._id ,isConfirmed:true});
          if (!userExist) {
              return next(new AppError(messages.user.notFound,404));
          }
      

        

          // Store authenticated user in request object
          req.authUser = userExist;
          next();
      } catch (error) {
          return next(new Error("Authentication failed"));
      }
  }
