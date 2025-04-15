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