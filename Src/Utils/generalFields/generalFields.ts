import joi from 'joi'
import { roles } from '../constant/enum'
export const generalFields={
    firstName:joi.string().max(15).min(3),
    lastName:joi.string().max(15).min(3),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword:joi.string().valid(joi.ref('password')),
    role:joi.string().valid(...Object.values(roles)),
    otpEmail:joi.string(),
    DOB:joi.string(),
    objectId:joi.string().hex().length(24),
    refreshToken:joi.string(),
    idToken:joi.string(),
    phone:joi.string().pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
}