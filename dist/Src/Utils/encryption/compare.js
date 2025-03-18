"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const comparePassword = ({ password, hashPassword }) => {
    return bcrypt_1.default.compareSync(password, hashPassword);
};
exports.comparePassword = comparePassword;
