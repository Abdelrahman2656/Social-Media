"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const AppError_1 = require("../../Utils/AppError/AppError");
const cloud_1 = __importDefault(require("../../Utils/Cloud-Upload/cloud"));
const post_model_1 = require("../../../Database/Model/post.model");
const messages_1 = require("../../Utils/constant/messages");
//---------------------------------------------------Create Post--------------------------------------------------------------
const createPost = async (req, res, next) => {
    //get data from req
    const { content } = req.body;
    const userId = req.authUser?._id;
    // upload image 
    let failImages = [];
    let attachment = [];
    if (Array.isArray(req.files)) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloud_1.default.uploader.upload(file.path, {
                folder: `Social-Media/Users/${userId}/Posts`
            });
            attachment.push({ secure_url, public_id });
            failImages.push(public_id);
        }
    }
    console.log(attachment);
    //create post
    const post = new post_model_1.Post({
        content,
        attachment,
        publisher: userId
    });
    const postCreated = await post.save();
    if (!postCreated) {
        req.failImages = failImages;
        return next(new AppError_1.AppError(messages_1.messages.post.failToCreate, 500));
    }
    //send response
    return res.status(201).json({ message: messages_1.messages.post.createdSuccessfully, success: true, postData: postCreated });
};
exports.createPost = createPost;
