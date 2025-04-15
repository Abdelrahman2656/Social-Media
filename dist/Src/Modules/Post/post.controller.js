"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../Middleware/authentication");
const authorization_1 = require("../../Middleware/authorization");
const enum_1 = require("../../Utils/constant/enum");
const Cloud_Upload_1 = require("../../Utils/Cloud-Upload");
const validation_1 = require("../../Middleware/validation");
const postService = __importStar(require("./post.service"));
const postValidation = __importStar(require("./post.validation"));
const asyncHandler_1 = require("../../Middleware/asyncHandler");
const postRouter = (0, express_1.Router)();
//create post
postRouter.post("/create-post", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, Cloud_Upload_1.cloudUpload)({}).array("attachment", 5), (0, validation_1.isValid)(postValidation.createPostVal), (0, asyncHandler_1.asyncHandler)(postService.createPost));
//like or unlike
postRouter.patch("/like-or-unlike/:userId", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, validation_1.isValid)(postValidation.likeOrUnlike), (0, asyncHandler_1.asyncHandler)(postService.likeOrUnlike));
exports.default = postRouter;
