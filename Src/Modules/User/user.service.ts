
import { User } from "../../../Database";
import { AppError } from "../../Utils/AppError/AppError";
import { messages } from "../../Utils/constant/messages";
import {  generateAndSecondSendOTP, generateAndSendOTP, secondOTPForgetPassword, sendOTPForgetPassword } from "../../Utils/Email/emailEvent";
import { comparePassword, Encrypt, Hash } from "../../Utils/encryption";
import { generateToken, verifyToken } from "../../Utils/Token/token";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";
import { generateOTP } from "../../Utils/otp";
import { verifyGoogleToken } from "../../Utils/verifyGoogle/verifyGoogle";
import { providers } from "../../Utils/constant/enum";


//---------------------------------------------------Sign Up --------------------------------------------------------------
export const signUp = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  let { firstName,phone ,lastName, email, password, role} = req.body;
  //check userExist
  let userExist = await User.findOne({ email });
  


  //send email
  if (userExist) {
    if (userExist.isConfirmed) {
      return next(new AppError(messages.user.alreadyExist, 400)); // Prevent duplicate accounts
    }
    if(userExist.provider == providers.GOOGLE){
      return next (new AppError('User Already Login With Google',400))
    }
    if (userExist?.otpEmail && userExist?.expiredDateOtp?.getTime() > Date.now()) {
      return next(new AppError(messages.user.AlreadyHasOtp, 400));
    }

    // If OTP is expired, resend a new OTP
    if (!userExist?.expiredDateOtp || userExist.expiredDateOtp.getTime() < Date.now()) {
      await generateAndSecondSendOTP(email, firstName, lastName); // Ensure OTP is sent
      return res.status(200).json({
        message: "OTP expired. A new OTP has been sent.",
        success: false,
      });
    }
  }
  //crypt phone
  
let cipherText=Encrypt({key :phone,secretKey:process.env.SECRET_CRYPTO }) 
  //hash password
  password = await Hash({
    key: password,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  
  //create user
  const user = new User({
    firstName,
    lastName,
    email,
    phone:cipherText || undefined,
    password,
    role,
    
  });
  const userCreated = await user.save();
  if (!userCreated) {
    return next(new AppError(messages.user.failToCreate, 500));
  }
  await generateAndSendOTP(email,firstName,lastName)
  // response
  return res.status(201).json({
    message: messages.user.createdSuccessfully,
    success: true,
    UserData: userCreated,
  });
};
//---------------------------------------------------Confirm Email --------------------------------------------------------------
export const ConfirmEmail = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  let { code, email } = req.body;
  //check email existence
  let userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  if(userExist.isConfirmed == true){
    return next(new AppError(messages.user.AlreadyVerified,401))
  }
  if (!userExist.otpEmail) {
    return next(new AppError("OTP Not Found", 400));
  }

  //compare otp
  let match = comparePassword({
    password:  String(code),
    hashPassword: userExist.otpEmail.toString(),
  });
  if (!match) {
    return next(new AppError(messages.user.invalidOTP, 400));
  }

  //update user
  await User.updateOne(
    { email },
    { isConfirmed: true, $unset: { otpEmail: "", expiredDateOtp: "" } }
  );
  await userExist.save();

  //send response
  return res
    .status(201)
    .json({ message: messages.user.verifiedSuccessfully, success: true });
};
//---------------------------------------------------Login --------------------------------------------------------------
export const login = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  let { email, password } = req.body;
  //check user existence
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //compare password
  let match = comparePassword({
    password,
    hashPassword: userExist.password?.toString() || "",
  })
  if (!match) {
    return next(new AppError(messages.user.Incorrect, 400));
  }
  //generate token
  const accessToken = generateToken({
    payload: { email, id: userExist.id },
    options: { expiresIn: '1d' },
  });
  const refreshToken = generateToken({
    payload: { email, id: userExist.id },
    options: { expiresIn: "7d" },
  });
  //return response
  return res
    .status(200)
    .json({
      message: messages.user.loginSuccessfully,
      success: true,
      accessToken,
      refreshToken,
    });
};
//---------------------------------------------------Login With Google --------------------------------------------------------------
export const loginWithGoogle = async(req:AppRequest,res:AppResponse,next:AppNext)=>{
//get data from req 
let {idToken}=req.body
//check token from google 
let {email, given_name ,family_name}= await verifyGoogleToken(idToken)
//check user exist
let userExist =await User.findOne({email})
if(!userExist){
  userExist=await User.create({
    email,
    firstName:given_name,
    lastName:family_name,
    provider:providers.GOOGLE,
    isConfirmed:true,
    phone: undefined,
  })
}
  //generate token
  const accessToken = generateToken({
    payload: { email, id: userExist.id },
    options: { expiresIn: "1d" },
  });
  const refreshToken = generateToken({
    payload: { email, id: userExist.id },
    options: { expiresIn: "7d" },
  });
  //return response
  return res
    .status(200)
    .json({
      message: messages.user.loginSuccessfully,
      success: true,
      accessToken,
      refreshToken,
    });
};

//---------------------------------------------------Activate Account--------------------------------------------------------------
export const activateAccount = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  let { token } = req.params;
  if (!token) {
    return next(new AppError("Verification token is missing", 400));
  }
  // decode token
  const result = verifyToken({ token });
  if (!result || typeof result !== "object" || !("id" in result)) {
    return next(result);
  }
  // update user
  let user = await User.findByIdAndUpdate(result.id, { isConfirmed: true });
  if (!user) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //return response
  res.status(200).json({ message: messages.user.login, success: true });
};
//---------------------------------------------------Refresh Token--------------------------------------------------------------
export const refreshToken = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get token from req
  let { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError("Verification token is missing", 400));
  }
  //decode token
  const result = verifyToken({ token: refreshToken });
  if ("message" in result) {
    return next(new Error(result.message));
  }
  //generate token
  const accessToken = generateToken({
    payload: { email: result.email, id: result.id },
    options: { expiresIn: "7d" },
  });
  //send response
  return res.status(200).json({ success: true, accessToken });
};
//---------------------------------------------------Forget Password--------------------------------------------------------------
export const forgetPassword = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get email from req
  let { email } = req.body;
  //checkExistence
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //check if user already have otp
  if (userExist.otpEmail && userExist.expiredDateOtp.getTime() > Date.now()) {
    return next(new AppError(messages.user.AlreadyHasOtp, 400));
  }
  //generate OTP
  let forgetOTP = String(generateOTP());
  //hash
  userExist.otpEmail = forgetOTP;
  userExist.expiredDateOtp = new Date(Date.now() + 10 * 1000);
  //update
  setTimeout(async () => {
    await User.updateOne(
      { _id: userExist._id, expiredDateOtp: { $lte: Date.now() } },
      { $unset: { otpEmail: "", expiredDateOtp: "" } }
    );
  }, 20 * 1000);
  //save to db
  await userExist.save();
  //send email
  sendOTPForgetPassword(email,userExist.firstName,userExist.lastName,forgetOTP)
  //send response
  return res
    .status(200)
    .json({ message: messages.user.checkEmail, success: true });
};
//---------------------------------------------------Change Password--------------------------------------------------------------
export const changePassword = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  let { otpEmail, email, password } = req.body;
  //check existence
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  //check otp
  if (userExist.otpEmail !== otpEmail) {
    return next(new AppError(messages.user.invalidOTP, 401));
  }
  //if otp expired
  if (userExist.expiredDateOtp.getTime() < Date.now()) {
    //generate otp
    let secondForgetPassword = String(generateOTP())
    let hash = await Hash({key :secondForgetPassword ,SALT_ROUNDS:process.env.SALT_ROUNDS})
    //add to otp
    userExist.otpEmail = hash;
    userExist.expiredDateOtp = new Date(Date.now() + 20 * 1000);
    //save to db
    await userExist.save();
    //send resend email
  secondOTPForgetPassword(email,userExist.firstName,userExist.lastName,secondForgetPassword)
  }
  //if every thing good then
  let hashPassword = Hash({
    key: password,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  //update in db
  await User.updateOne(
    { email },
    { password: hashPassword, $unset: { otpEmail: "", expiredDateOtp: "" } }
  );
  //send response 
  return res.status(200).json({success:true , message:messages.user.updateSuccessfully})
};





