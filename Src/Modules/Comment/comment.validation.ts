import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";

//create comment 
export const createComment = joi.object({
    postId:generalFields.objectId.required(),
    text:generalFields.text.required(),
attachment:generalFields.image.when("text",{
    is:joi.exist(),
    then:joi.optional(),
    otherwise:joi.required()
}),
    voice:generalFields.image.optional() ,
})
//get comment
export const getComment =joi.object({
    postId:generalFields.objectId
}).required()