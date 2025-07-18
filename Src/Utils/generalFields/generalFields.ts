import joi from "joi";
import { roles } from "../constant/enum";
export const generalFields = {
  firstName: joi.string().max(15).min(3),
  lastName: joi.string().max(15).min(3),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 4,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    ),
  cPassword: joi.string().valid(joi.ref("password")),
  role: joi.string().valid(...Object.values(roles)),
  otpEmail: joi.string(),
  text:joi.string().max(200),
  DOB: joi.string(),
  objectId: joi.string().hex().length(24),
  refreshToken: joi.string(),
  idToken: joi.string(),
  phone: joi
    .string()
    .pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
  content: joi.string(),
  attachment: joi.array().items(
    joi.object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      path: joi.string().required(),
    })
  ),
    image:
    joi.object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().positive().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      path: joi.string().required(),
    }),
    voice: joi.array().items(
    joi.object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      size: joi.number().positive().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      path: joi.string().required(),
    })
  ),
};
