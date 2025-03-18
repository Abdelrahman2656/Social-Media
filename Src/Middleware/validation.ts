import  { ObjectSchema } from 'joi'
import { AppNext, AppRequest, AppResponse } from "../Utils/type"
import { AppError } from '../Utils/AppError/AppError'


export const isValid =(schema:ObjectSchema)=>{
    return(req:AppRequest,res:AppResponse,next:AppNext)=>{
    let data = {...req.body,...req.params,...req.query}
    let{error}=schema.validate(data,{abortEarly:false})
    if(error){
        const errMSG: string[] = error.details.map((err) => err.message);
        return next(new AppError(errMSG.join(", "), 400));
    }
    next()
    }
  
}