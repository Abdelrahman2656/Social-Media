"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.forgetPassword = exports.refreshToken = exports.activateAccount = exports.loginWithGoogle = exports.login = exports.ConfirmEmail = exports.signUp = void 0;
const Database_1 = require("../../../../Database");
const AppError_1 = require("../../../Utils/AppError/AppError");
const cloud_1 = __importDefault(require("../../../Utils/Cloud-Upload/cloud"));
const enum_1 = require("../../../Utils/constant/enum");
const messages_1 = require("../../../Utils/constant/messages");
const emailEvent_1 = require("../../../Utils/Email/emailEvent");
const encryption_1 = require("../../../Utils/encryption");
const otp_1 = require("../../../Utils/otp");
const token_1 = require("../../../Utils/Token/token");
const verifyGoogle_1 = require("../../../Utils/verifyGoogle/verifyGoogle");
let generateCustomCode;
(async () => {
    const { customAlphabet } = await Promise.resolve().then(() => __importStar(require("nanoid")));
    generateCustomCode = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
})();
//---------------------------------------------------Sign Up --------------------------------------------------------------
const signUp = async (req, res, next) => {
    //get data from req
    let { firstName, phone, lastName, email, password, role } = req.body;
    //upload image
    if (!req.file && req.body.provider === enum_1.providers.SYSTEM) {
        return next(new AppError_1.AppError("Image is required", 400));
    }
    if (!req.file) {
        // fallback safe guard
        return next(new AppError_1.AppError("Something went wrong with the file upload", 400));
    }
    const userCode = generateCustomCode();
    let { secure_url, public_id } = await cloud_1.default.uploader.upload(req.file.path, {
        folder: `Social-Media/Users/Profile/${userCode}`
    });
    req.failImage = { secure_url, public_id };
    //check userExist
    let userExist = await Database_1.User.findOne({ email });
    console.log(req.file);
    //send email
    if (userExist) {
        if (userExist.isConfirmed) {
            return next(new AppError_1.AppError(messages_1.messages.user.alreadyExist, 400)); // Prevent duplicate accounts
        }
        if (userExist.provider == enum_1.providers.GOOGLE) {
            return next(new AppError_1.AppError('User Already Login With Google', 400));
        }
        if (userExist?.otpEmail && userExist?.expiredDateOtp?.getTime() > Date.now()) {
            return next(new AppError_1.AppError(messages_1.messages.user.AlreadyHasOtp, 400));
        }
        // If OTP is expired, resend a new OTP
        if (!userExist?.expiredDateOtp || userExist.expiredDateOtp.getTime() < Date.now()) {
            await (0, emailEvent_1.generateAndSecondSendOTP)(email, firstName, lastName); // Ensure OTP is sent
            return res.status(200).json({
                message: "OTP expired. A new OTP has been sent.",
                success: false,
            });
        }
    }
    //crypt phone
    let cipherText = (0, encryption_1.Encrypt)({ key: phone, secretKey: process.env.SECRET_CRYPTO });
    //create user
    const user = new Database_1.User({
        firstName,
        lastName,
        email,
        phone: cipherText || undefined,
        password,
        role,
        attachment: { secure_url, public_id },
        userCode
    });
    const userCreated = await user.save();
    if (!userCreated) {
        req.failImage = { secure_url, public_id };
        return next(new AppError_1.AppError(messages_1.messages.user.failToCreate, 500));
    }
    await (0, emailEvent_1.generateAndSendOTP)(email, firstName, lastName);
    // response
    return res.status(201).json({
        message: messages_1.messages.user.createdSuccessfully,
        success: true,
        UserData: userCreated,
    });
};
exports.signUp = signUp;
//---------------------------------------------------Confirm Email --------------------------------------------------------------
const ConfirmEmail = async (req, res, next) => {
    //get data from req
    let { code, email } = req.body;
    //check email existence
    let userExist = await Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    if (userExist.isConfirmed == true) {
        return next(new AppError_1.AppError(messages_1.messages.user.AlreadyVerified, 401));
    }
    if (!userExist.otpEmail) {
        return next(new AppError_1.AppError("OTP Not Found", 400));
    }
    //compare otp
    let match = (0, encryption_1.comparePassword)({
        password: String(code),
        hashPassword: userExist.otpEmail.toString(),
    });
    if (!match) {
        return next(new AppError_1.AppError(messages_1.messages.user.invalidOTP, 400));
    }
    //update user
    await Database_1.User.updateOne({ email }, { isConfirmed: true, $unset: { otpEmail: "", expiredDateOtp: "" } });
    await userExist.save();
    //send response
    return res
        .status(201)
        .json({ message: messages_1.messages.user.verifiedSuccessfully, success: true });
};
exports.ConfirmEmail = ConfirmEmail;
//---------------------------------------------------Login --------------------------------------------------------------
const login = async (req, res, next) => {
    //get data from req
    let { email, password } = req.body;
    //check user existence
    const userExist = await Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //compare password
    let match = (0, encryption_1.comparePassword)({
        password,
        hashPassword: userExist.password?.toString() || "",
    });
    if (!match) {
        return next(new AppError_1.AppError(messages_1.messages.user.Incorrect, 400));
    }
    //generate token
    const accessToken = (0, token_1.generateToken)({
        payload: { email, id: userExist._id },
        options: { expiresIn: '1d' },
    });
    const refreshToken = (0, token_1.generateToken)({
        payload: { email, id: userExist._id },
        options: { expiresIn: "7d" },
    });
    //return response
    return res
        .status(200)
        .json({
        message: messages_1.messages.user.loginSuccessfully,
        success: true,
        access_token: accessToken,
        refresh_token: refreshToken,
    });
};
exports.login = login;
//---------------------------------------------------Login With Google --------------------------------------------------------------
const loginWithGoogle = async (req, res, next) => {
    //get data from req 
    let { idToken } = req.body;
    //check token from google 
    let { email, given_name, family_name } = await (0, verifyGoogle_1.verifyGoogleToken)(idToken);
    //check user exist
    let userExist = await Database_1.User.findOne({ email });
    if (!userExist) {
        userExist = await Database_1.User.create({
            email,
            firstName: given_name,
            lastName: family_name,
            provider: enum_1.providers.GOOGLE,
            isConfirmed: true,
            phone: undefined,
        });
    }
    //generate token
    const accessToken = (0, token_1.generateToken)({
        payload: { email, id: userExist._id },
        options: { expiresIn: "1d" },
    });
    const refreshToken = (0, token_1.generateToken)({
        payload: { email, id: userExist._id },
        options: { expiresIn: "7d" },
    });
    //return response
    return res
        .status(200)
        .json({
        message: messages_1.messages.user.loginSuccessfully,
        success: true,
        access_token: accessToken,
        refresh_token: refreshToken,
    });
};
exports.loginWithGoogle = loginWithGoogle;
//---------------------------------------------------Activate Account--------------------------------------------------------------
const activateAccount = async (req, res, next) => {
    //get data from req
    let { token } = req.params;
    if (!token) {
        return next(new AppError_1.AppError("Verification token is missing", 400));
    }
    // decode token
    const result = (0, token_1.verifyToken)({ token });
    if (!result || typeof result !== "object" || !("id" in result)) {
        return next(result);
    }
    // update user
    let user = await Database_1.User.findByIdAndUpdate(result.id, { isConfirmed: true });
    if (!user) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //return response
    res.status(200).json({ message: messages_1.messages.user.login, success: true });
};
exports.activateAccount = activateAccount;
//---------------------------------------------------Refresh Token--------------------------------------------------------------
const refreshToken = async (req, res, next) => {
    //get token from req
    let { refreshToken } = req.body;
    if (!refreshToken) {
        return next(new AppError_1.AppError("Verification token is missing", 400));
    }
    //decode token
    const result = (0, token_1.verifyToken)({ token: refreshToken });
    if (!result) {
        return next(new AppError_1.AppError("Invalid or expired token", 401));
    }
    if (!result || typeof result !== "object" || !("email" in result) || !("_id" in result)) {
        return next(new AppError_1.AppError("Invalid or expired token", 401));
    }
    //generate token
    const accessToken = (0, token_1.generateToken)({
        payload: { email: result.email, id: result._id },
        options: { expiresIn: "7d" },
    });
    //send response
    return res.status(200).json({ success: true, accessToken });
};
exports.refreshToken = refreshToken;
//---------------------------------------------------Forget Password--------------------------------------------------------------
const forgetPassword = async (req, res, next) => {
    //get email from req
    let { email } = req.body;
    //checkExistence
    const userExist = await Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //check if user already have otp
    if (userExist.otpEmail && userExist.expiredDateOtp.getTime() > Date.now()) {
        return next(new AppError_1.AppError(messages_1.messages.user.AlreadyHasOtp, 400));
    }
    //generate OTP
    let forgetOTP = String((0, otp_1.generateOTP)());
    //hash
    userExist.otpEmail = forgetOTP;
    userExist.expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
    //update
    setTimeout(async () => {
        await Database_1.User.updateOne({ _id: userExist._id, expiredDateOtp: { $lte: Date.now() } }, { $unset: { otpEmail: "", expiredDateOtp: "" } });
    }, 5 * 60 * 1000);
    //save to db
    await userExist.save();
    //send email
    (0, emailEvent_1.sendOTPForgetPassword)(email, userExist.firstName, userExist.lastName, forgetOTP);
    //send response
    return res
        .status(200)
        .json({ message: messages_1.messages.user.checkEmail, success: true });
};
exports.forgetPassword = forgetPassword;
//---------------------------------------------------Change Password--------------------------------------------------------------
const changePassword = async (req, res, next) => {
    //get data from req
    let { otpEmail, email, password } = req.body;
    //check existence
    const userExist = await Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //check otp
    if (userExist.otpEmail !== otpEmail) {
        return next(new AppError_1.AppError(messages_1.messages.user.invalidOTP, 401));
    }
    //if otp expired
    if (userExist.expiredDateOtp.getTime() < Date.now()) {
        //generate otp
        let secondForgetPassword = String((0, otp_1.generateOTP)());
        let hash = await (0, encryption_1.Hash)({ key: secondForgetPassword, SALT_ROUNDS: process.env.SALT_ROUNDS });
        //add to otp
        userExist.otpEmail = hash;
        userExist.expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
        //save to db
        await userExist.save();
        //send resend email
        (0, emailEvent_1.secondOTPForgetPassword)(email, userExist.firstName, userExist.lastName, secondForgetPassword);
    }
    //if every thing good then
    let hashPassword = (0, encryption_1.Hash)({
        key: password,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
    //update in db
    await Database_1.User.updateOne({ email }, { password: hashPassword, $unset: { otpEmail: "", expiredDateOtp: "" } });
    //send response 
    return res.status(200).json({ success: true, message: messages_1.messages.user.updateSuccessfully });
};
exports.changePassword = changePassword;
