import  { ObjectSchema } from 'joi'
import { AppNext, AppRequest, AppResponse } from "../Utils/type"
import { AppError } from '../Utils/AppError/AppError'


export const isValid =(schema:ObjectSchema)=>{
    return(req:AppRequest,res:AppResponse,next:AppNext)=>{
    let data = {...req.body,...req.params,...req.query}
   if (req.file) {
      data.attachment = req.file;
    } else if (Array.isArray(req.files)) {
      data.attachment = req.files;
    } else if (req.files && typeof req.files === "object") {
      for (const key in req.files) {
        const field = req.files[key];
        if (Array.isArray(field) && field.length > 0) {
          data[key] = field[0]; // ✅ نمرر أول ملف بس
        }
      }
    }
    let{error}=schema.validate(data,{abortEarly:false})
    if(error){
        const errMSG: string[] = error.details.map((err) => err.message);
        return next(new AppError(errMSG.join(", "), 400));
    }
    next()
    }
  
}