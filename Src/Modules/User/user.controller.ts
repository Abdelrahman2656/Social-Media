import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { isValid } from "../../Middleware/validation";
import * as US from './Services/user.service';
import * as VA from './user.validation';
import { cloudUpload, fileValidation } from "../../Utils/Cloud-Upload";
import { isAuthentication } from "../../Middleware/authentication";
const userRouter = Router()
// sign up
userRouter.post('/signup',cloudUpload([...fileValidation.image]).single("attachment"),isValid(VA.signUpVal),asyncHandler(US.signUp))
// confirm email 
userRouter.patch('/confirm-email',isValid(VA.confirmEmailVal),asyncHandler(US.ConfirmEmail))
//activate-account
userRouter.get('/activate-account/:token',asyncHandler(US.activateAccount))
//refresh-Token
userRouter.post('/refresh-token',isValid(VA.refreshTokenVal),asyncHandler(US.refreshToken))
//login
userRouter.post('/signin',isValid(VA.signInVal),asyncHandler(US.login))
//login with google
userRouter.post('/google-login',isValid(VA.loginWithGoogleVal),asyncHandler(US.loginWithGoogle))
//forget password
userRouter.post('/forget-password',isValid(VA.forgetPasswordVal),asyncHandler(US.forgetPassword))
//change password 
userRouter.put('/change-password',isValid(VA.changePasswordVal),asyncHandler(US.changePassword))
//share Profile
userRouter.get("/profile/:profileId",isAuthentication,isValid(VA.shareProfile),asyncHandler(US.shareProfile))
//share Profile
userRouter.get("/profile-qrcode/:profileId",isAuthentication,isValid(VA.shareProfileWithQrCode),asyncHandler(US.shareProfileWithQrCode))
export default userRouter