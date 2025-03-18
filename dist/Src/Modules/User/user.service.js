"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.forgetPassword = exports.refreshToken = exports.activateAccount = exports.loginWithGoogle = exports.login = exports.ConfirmEmail = exports.signUp = void 0;
const Database_1 = require("../../../Database");
const AppError_1 = require("../../Utils/AppError/AppError");
const messages_1 = require("../../Utils/constant/messages");
const emailEvent_1 = require("../../Utils/Email/emailEvent");
const encryption_1 = require("../../Utils/encryption");
const token_1 = require("../../Utils/Token/token");
const otp_1 = require("../../Utils/otp");
const verifyGoogle_1 = require("../../Utils/verifyGoogle/verifyGoogle");
const enum_1 = require("../../Utils/constant/enum");
//---------------------------------------------------Sign Up --------------------------------------------------------------
const signUp = async (req, res, next) => {
    //get data from req
    let { firstName, phone, lastName, email, password, role } = req.body;
    //check userExist
    let userExist = await Database_1.User.findOne({ email });
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
    //hash password
    password = await (0, encryption_1.Hash)({
        key: password,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
    });
    //create user
    const user = new Database_1.User({
        firstName,
        lastName,
        email,
        phone: cipherText || undefined,
        password,
        role,
    });
    const userCreated = await user.save();
    if (!userCreated) {
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
        payload: { email, id: userExist.id },
        options: { expiresIn: '1d' },
    });
    const refreshToken = (0, token_1.generateToken)({
        payload: { email, id: userExist.id },
        options: { expiresIn: "7d" },
    });
    //return response
    return res
        .status(200)
        .json({
        message: messages_1.messages.user.loginSuccessfully,
        success: true,
        accessToken,
        refreshToken,
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
        payload: { email, id: userExist.id },
        options: { expiresIn: "1d" },
    });
    const refreshToken = (0, token_1.generateToken)({
        payload: { email, id: userExist.id },
        options: { expiresIn: "7d" },
    });
    //return response
    return res
        .status(200)
        .json({
        message: messages_1.messages.user.loginSuccessfully,
        success: true,
        accessToken,
        refreshToken,
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
    if ("message" in result) {
        return next(new Error(result.message));
    }
    //generate token
    const accessToken = (0, token_1.generateToken)({
        payload: { email: result.email, id: result.id },
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
    userExist.expiredDateOtp = new Date(Date.now() + 10 * 1000);
    //update
    setTimeout(async () => {
        await Database_1.User.updateOne({ _id: userExist._id, expiredDateOtp: { $lte: Date.now() } }, { $unset: { otpEmail: "", expiredDateOtp: "" } });
    }, 20 * 1000);
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
        userExist.expiredDateOtp = new Date(Date.now() + 20 * 1000);
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
