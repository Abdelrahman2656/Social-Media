"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecificPost = exports.likeOrUnlike = exports.createPostVal = void 0;
const joi_1 = __importDefault(require("joi"));
const generalFields_1 = require("../../Utils/generalFields/generalFields");
// create post
exports.createPostVal = joi_1.default.object({
    content: generalFields_1.generalFields.content,
    attachment: generalFields_1.generalFields.attachment,
    publisher: generalFields_1.generalFields.objectId
}).or('content', 'attachment');
//like or unlike
exports.likeOrUnlike = joi_1.default.object({
    userId: generalFields_1.generalFields.objectId.required()
}).required();
//get specific post
exports.getSpecificPost = joi_1.default.object({
    id: generalFields_1.generalFields.objectId.required()
}).required();
