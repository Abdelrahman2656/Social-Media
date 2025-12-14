"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserCode = void 0;
const nanoid_1 = require("nanoid");
const generateUserCode = () => {
    const generate = (0, nanoid_1.customAlphabet)("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
    return generate();
};
exports.generateUserCode = generateUserCode;
