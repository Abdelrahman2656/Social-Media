
import { AppError } from "../../Utils/AppError/AppError";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";
import cloudinary from "../../Utils/Cloud-Upload/cloud";
import { Post } from "../../../Database/Model/post.model";
import { messages } from "../../Utils/constant/messages";

//---------------------------------------------------Create Post--------------------------------------------------------------
export const createPost = async(req:AppRequest,res:AppResponse,next:AppNext)=>{
    //get data from req
    const {content }=req.body
    const userId = req.authUser?._id ;
    // upload image 
    let failImages = []
    let attachment = []
    if (Array.isArray(req.files)) {
        for (const file of req.files) {
          const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{
            folder:`Social-Media/Users/${userId}/Posts`
          })
          attachment.push({secure_url,public_id})
          failImages.push(public_id)
        }
      }
      console.log(attachment);
      //create post
      const post = new Post({
        content,
        attachment,
        publisher:userId
      })
      const postCreated = await post.save()
      if(!postCreated){
        req.failImages=failImages
        return next(new AppError(messages.post.failToCreate,500))
      }
      //send response
      return res.status(201).json({message:messages.post.createdSuccessfully , success:true , postData:postCreated})
      
}