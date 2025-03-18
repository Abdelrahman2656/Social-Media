"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Hash = ({ key, SALT_ROUNDS = process.env.SALT_ROUNDS }) => {
    return bcrypt_1.default.hashSync(key, Number(SALT_ROUNDS));
};
exports.Hash = Hash;
