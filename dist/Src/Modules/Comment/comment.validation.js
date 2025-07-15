"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComment = exports.createComment = void 0;
const joi_1 = __importDefault(require("joi"));
const generalFields_1 = require("../../Utils/generalFields/generalFields");
//create comment 
exports.createComment = joi_1.default.object({
    postId: generalFields_1.generalFields.objectId.required(),
    text: generalFields_1.generalFields.text.required(),
    attachment: generalFields_1.generalFields.image.when("text", {
        is: joi_1.default.exist(),
        then: joi_1.default.optional(),
        otherwise: joi_1.default.required()
    }),
    voice: generalFields_1.generalFields.image.optional(),
});
//get comment
exports.getComment = joi_1.default.object({
    postId: generalFields_1.generalFields.objectId
}).required();
