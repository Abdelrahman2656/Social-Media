import Joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";

//update tole
export const updateRole= Joi.object({
    userId : generalFields.objectId.required(),
    role:generalFields.role.required()
}).required()