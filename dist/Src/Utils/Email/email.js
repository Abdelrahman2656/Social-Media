"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        port: 456,
        secure: true,
        auth: {
            user: process.env.USER_SENDER,
            pass: process.env.PASS_EMAIL
        }
    });
    await transporter.sendMail({
        to,
        from: `"Smart Choice Account" <${process.env.USER_SENDER}>`,
        subject,
        html,
        attachments
    });
    console.log(`✅ Email sent to ${to}`);
};
exports.sendEmail = sendEmail;
