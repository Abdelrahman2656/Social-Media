import { providers } from "../../Utils/constant/enum";
import { generalFields } from "../../Utils/generalFields/generalFields";
import joi from 'joi'
//sign up
export const signUpVal = joi.object({
firstName:generalFields.firstName.required(),
lastName:generalFields.lastName.required(),
email:generalFields.email.required(),
provider: joi.string()
.valid(providers.SYSTEM, providers.GOOGLE),
password:generalFields.password.when("provider", {
    is: providers.SYSTEM,
    then: joi.string().min(6).required(), // Password required for SYSTEM
    otherwise: joi.string().optional()}), // Not required for Google,
cPassword:generalFields.cPassword.required(),
DOB:generalFields.DOB,
otpEmail:generalFields.otpEmail,
phone:generalFields.phone.optional()

})
//confirm Email
export const confirmEmailVal = joi.object({
    email:generalFields.email.required(),
    code:generalFields.otpEmail.max(6).required()
}).required()
//sign in
export const signInVal = joi.object({
    email:generalFields.email.required(),
        provider: joi.string()
    .valid(providers.SYSTEM, providers.GOOGLE),
    password: joi.alternatives().conditional("provider", {
        is: providers.SYSTEM,
        then: generalFields.password.required(), 
        otherwise: joi.optional()}), 
       phone:generalFields.phone.optional()
    })
    
//refresh token
export const refreshTokenVal = joi.object({
    refreshToken:generalFields.refreshToken.required()
}).required()
//forget password 
export const forgetPasswordVal = joi.object({
    email:generalFields.email.required(),
    
})
//change password 
export const changePasswordVal =joi.object({
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:generalFields.cPassword.required(),
    otpEmail:generalFields.otpEmail.required()
}).required()
//login with google
export const loginWithGoogleVal =joi.object({
    idToken:generalFields.idToken.required()
}).required()