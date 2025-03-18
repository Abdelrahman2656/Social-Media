"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondOTPForgetPassword = exports.sendOTPForgetPassword = exports.generateAndSecondSendOTP = exports.generateAndSendOTP = void 0;
const Database_1 = require("../../../Database");
const encryption_1 = require("../encryption");
const email_1 = require("./email");
const emailHtml_1 = require("./emailHtml");
const otp_1 = require("../otp");
// Separate event listener (should be declared once in your setup)
const generateAndSendOTP = async (email, firstName, lastName) => {
    let otp = String((0, otp_1.generateOTP)());
    const hash = await (0, encryption_1.Hash)({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
    // Ensure expiredDateOtp is always set
    const expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
    await Database_1.User.updateOne({ email }, { otpEmail: hash, expiredDateOtp });
    // Send email after updating the database
    await (0, email_1.sendEmail)({
        to: email,
        subject: "Please Verify",
        html: (0, emailHtml_1.emailHtml)(otp, `${firstName} ${lastName}`),
    });
};
exports.generateAndSendOTP = generateAndSendOTP;
//second OTP to Confirm email 
const generateAndSecondSendOTP = async (email, firstName, lastName) => {
    let otp = String((0, otp_1.generateOTP)());
    const hash = await (0, encryption_1.Hash)({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
    // Ensure expiredDateOtp is always set
    const expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
    await Database_1.User.updateOne({ email }, { otpEmail: hash, expiredDateOtp });
    // Send email after updating the database
    await (0, email_1.sendEmail)({
        to: email,
        subject: "Please Resend Verify",
        html: (0, emailHtml_1.emailHtml)(otp, `${firstName} ${lastName}`),
    });
};
exports.generateAndSecondSendOTP = generateAndSecondSendOTP;
//forget password
const sendOTPForgetPassword = async (email, firstName, lastName, otpEmail) => {
    // Send email after updating the database
    await (0, email_1.sendEmail)({
        to: email,
        subject: "Forget Password",
        html: (0, emailHtml_1.emailHtml)(otpEmail, `${firstName} ${lastName}`),
    });
};
exports.sendOTPForgetPassword = sendOTPForgetPassword;
//resend forget password
const secondOTPForgetPassword = async (email, firstName, lastName, otpEmail) => {
    // Send email after updating the database
    await (0, email_1.sendEmail)({
        to: email,
        subject: "Resend Forget Password",
        html: (0, emailHtml_1.emailHtml)(otpEmail, `${firstName} ${lastName}`),
    });
};
exports.secondOTPForgetPassword = secondOTPForgetPassword;
