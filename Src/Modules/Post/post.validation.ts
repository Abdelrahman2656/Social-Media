import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";

// create post

export const createPostVal = joi.object({
content:generalFields.content,
attachment:generalFields.attachment,
publisher:generalFields.objectId
}).or('content','attachment')

//like or unlike
export const  likeOrUnlike = joi.object({
userId:generalFields.objectId.required()
}).required()
//get specific post
export const getSpecificPost = joi.object({
    id:generalFields.objectId.required()
}).required() 
// delete post
export const deletePost =joi.object({
    id:generalFields.objectId.required()
}).required()
//archive post
export const archivePost =joi.object({
    id:generalFields.objectId.required()
}).required()
//restore post
export const restorePost =joi.object({
    id:generalFields.objectId.required()
}).required()

