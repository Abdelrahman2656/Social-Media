"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.likeOrUnlike = exports.createPost = void 0;
const AppError_1 = require("../../../Utils/AppError/AppError");
const cloud_1 = __importDefault(require("../../../Utils/Cloud-Upload/cloud"));
const post_model_1 = require("../../../../Database/Model/post.model");
const messages_1 = require("../../../Utils/constant/messages");
const mongoose_1 = require("mongoose");
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
            const { secure_url, public_id, resource_type } = await cloud_1.default.uploader.upload(file.path, {
                folder: `Social-Media/Users/${userId}/Posts`,
                resource_type: "auto",
            });
            attachment.push({ secure_url, public_id, resource_type });
            failImages.push(public_id);
        }
    }
    console.log(attachment);
    //create post
    const post = new post_model_1.Post({
        content,
        attachment,
        publisher: userId,
    });
    const postCreated = await post.save();
    if (!postCreated) {
        req.failImages = failImages;
        return next(new AppError_1.AppError(messages_1.messages.post.failToCreate, 500));
    }
    //send response
    return res.status(201).json({
        message: messages_1.messages.post.createdSuccessfully,
        success: true,
        postData: postCreated,
    });
};
exports.createPost = createPost;
//---------------------------------------------------Like Or Unlike--------------------------------------------------------------
const likeOrUnlike = async (req, res, next) => {
    //get data from params
    const { userId } = req.params;
    //check post existence
    const postExist = await post_model_1.Post.findById(userId); //{} | null
    if (!postExist) {
        return next(new AppError_1.AppError(messages_1.messages.post.notFound, 404));
    }
    //check by index if user exist in likes array or not
    if (!req.authUser?._id) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    const userIdStr = req.authUser._id.toString();
    const userIndex = postExist.likes
        .map((id) => id.toString())
        .indexOf(userIdStr);
    if (userIndex == -1) {
        postExist.likes.push(new mongoose_1.Types.ObjectId(req.authUser._id.toString()));
    }
    else {
        postExist.likes.splice(userIndex, 1);
    }
    //save in db
    const postUpdated = await postExist.save();
    //send response
    return res.status(200).json({
        messages: messages_1.messages.post.updateSuccessfully,
        success: true,
        TotalLikes: postUpdated.likes.length,
        postUpdated,
    });
};
exports.likeOrUnlike = likeOrUnlike;
//---------------------------------------------------Get Posts--------------------------------------------------------------
const getPosts = async (req, res, next) => {
    //get post
    //1-populate
    // const posts = await Post.find().populate([
    //   {path :"publisher" , select:"firstName lastName attachment.secure_url"},
    //   {path:"likes" , select:"firstName lastName attachment.secure_url "}
    // ])
    //2-aggregate
    const posts = await post_model_1.Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "publisher",
                foreignField: "_id",
                as: "publisher",
            },
        },
        { $unwind: "$publisher" },
        {
            $lookup: {
                from: "users",
                localField: "likes",
                foreignField: "_id",
                as: "likes",
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
            },
        },
        {
            $project: {
                "publisher.firstName": 1,
                "publisher.lastName": 1,
                "publisher.attachment.secure_url": 1,
                "attachment.secure_url": 1,
                content: 1,
                "likes.firstName": 1,
                "likes.lastName": 1,
                "likes.attachment.secure_url": 1,
                comments: 1
            },
        },
    ]);
    //send response
    return res.status(200).json({ success: true, posts });
};
exports.getPosts = getPosts;
