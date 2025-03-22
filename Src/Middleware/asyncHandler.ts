import { AppError } from "../Utils/AppError/AppError";
import { deleteCloudImage } from "../Utils/Cloud-Upload";
import { AppNext, AppRequest, AppResponse } from "../Utils/type";

export const asyncHandler=( fn: (req:AppRequest,res:AppResponse,next:AppNext) => Promise<any>)=>{
    return(req:AppRequest,res:AppResponse,next:AppNext)=>{
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err);
          });

    }
}







export const globalErrorHandling =async(err:AppError,req:AppRequest,res:AppResponse,next:AppNext)=>{
    if(Array.isArray(req.failImages) && req.failImages.length > 0){
        for (const public_id of req.failImages) {
            await deleteCloudImage(public_id)
        }
    }
    if(process.env.MODE=='DEV'){
        return res.status(err.statusCode||500).json({message:err.message,success:false,stack:err.stack})
    }
    return res.status(err.statusCode||500).json({message:err.message,success:false})
}