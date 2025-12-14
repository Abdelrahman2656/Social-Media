import { Post, User } from "../../../../Database";
import { AppNext, AppRequest, AppResponse } from "../../../Utils/type";

export const getData =async (req:AppRequest,res:AppResponse,next:AppNext)=>{
const [userData , postData] = await Promise.all([User.find(),Post.find()])
//send response 
return res.status(200).json({success:true , Data:{
    userData,postData
}})
}