"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = void 0;
const joi_1 = __importDefault(require("joi"));
const generalFields_1 = require("../../Utils/generalFields/generalFields");
//update tole
exports.updateRole = joi_1.default.object({
    userId: generalFields_1.generalFields.objectId.required()
}).required();
