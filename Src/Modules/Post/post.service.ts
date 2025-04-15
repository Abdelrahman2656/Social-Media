
import { AppError } from "../../Utils/AppError/AppError";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";
import cloudinary from "../../Utils/Cloud-Upload/cloud";
import { Post } from "../../../Database/Model/post.model";
import { messages } from "../../Utils/constant/messages";
import { Types } from 'mongoose';
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
//---------------------------------------------------Like Or Unlike--------------------------------------------------------------
export const likeOrUnlike = async(req:AppRequest,res:AppResponse,next:AppNext)=>{
//get data from params
const{userId}=req.params
//check post existence
const postExist = await Post.findById(userId) //{} | null
if(!postExist){
  return next(new AppError(messages.post.notFound,404))
}
//check by index if user exist in likes array or not
if (!req.authUser?._id) {
  return next(new AppError("Unauthorized", 401));
}

const userIdStr = req.authUser._id.toString();
const userIndex = postExist.likes
  .map((id) => id.toString())
  .indexOf(userIdStr);
  if(userIndex == -1){
    postExist.likes.push(new Types.ObjectId(req.authUser._id.toString()));
  }else{
    postExist.likes.splice(userIndex , 1)
  }
  //save in db
  const postUpdated = await postExist.save()
  //send response
  return res.status(200).json({messages:messages.post.updateSuccessfully,success:true ,postUpdated})


}