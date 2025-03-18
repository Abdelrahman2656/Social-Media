"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const Decrypt = ({ key, secretKey = process.env.SECRET_CRYPTO }) => {
    return crypto_js_1.default.AES.decrypt(key, secretKey).toString(crypto_js_1.default.enc.Utf8);
};
exports.Decrypt = Decrypt;
