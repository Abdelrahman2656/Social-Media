import { AppError } from "../AppError/AppError";
import { AppRequest } from "../type";
import { fileValidation } from "./filevalidation";
import multer, { diskStorage, FileFilterCallback } from "multer"
export const cloudUpload = ({allowType= fileValidation.image}={})=>{
    //storage 
const storage = diskStorage({})
    //file filter
    const fileFilter = (req:AppRequest , file:Express.Multer.File,cb:FileFilterCallback)=>{
        console.log(file);
        if(allowType.includes(file.mimetype)){
        return cb(null,true)
        }
        cb(new AppError("invalid file format", 400))
    }
    //return
    return multer({
        storage,
        fileFilter
    })
}