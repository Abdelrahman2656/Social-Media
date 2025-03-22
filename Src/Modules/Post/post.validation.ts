import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";

// create post
export const createPostVal = joi.object({
content:generalFields.content,
attachment:generalFields.attachment,

}).or('content','attachment')