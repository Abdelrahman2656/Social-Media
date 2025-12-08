"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComment = exports.createComment = void 0;
const Database_1 = require("../../../../Database");
const AppError_1 = require("../../../Utils/AppError/AppError");
const cloud_1 = __importDefault(require("../../../Utils/Cloud-Upload/cloud"));
const messages_1 = require("../../../Utils/constant/messages");
//---------------------------------------------------Create Comment--------------------------------------------------------------
const createComment = async (req, res, next) => {
    //get data from req
    const { postId, id } = req.params;
    const { text } = req.body;
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    // console.log({post , text});
    //check post existence
    const postExistence = await Database_1.Post.findById(postId);
    if (!postExistence) {
        return next(new AppError_1.AppError(messages_1.messages.comment.notFound, 404));
    }
    //check if it reply or comment
    const isReply = Boolean(id);
    //upload attachment
    const files = req.files;
    console.log(files);
    let attachment;
    let failImages = [];
    if (files?.attachment && files.attachment.length > 0) {
        let { secure_url, public_id, resource_type } = await cloud_1.default.uploader.upload(files.attachment[0].path, {
            folder: `Social-Media/Users/${postExistence.publisher}/Posts/${isReply ? "Replies" : "Comment"}`,
            resource_type: "auto",
        });
        attachment = { secure_url, public_id, resource_type };
        failImages.push(public_id);
    }
    //upload voice
    const allowedAudioTypes = [
        "audio/midi",
        "audio/mpeg",
        "audio/webm",
        "audio/ogg",
        "audio/wav",
        "audio/x-wav",
        "audio/x-m4a",
        "audio/aac",
        "audio/mp3",
    ];
    let voice;
    if (files?.voice && files.voice.length > 0) {
        const voiceFile = files?.voice[0];
        if (!allowedAudioTypes.includes(voiceFile?.mimetype)) {
            return next(new AppError_1.AppError("Only audio files are allowed in 'voice' field", 400));
        }
        let { secure_url, public_id, resource_type, duration } = await cloud_1.default.uploader.upload(voiceFile.path, {
            folder: `Social-Media/Users/${postExistence.publisher}/Posts/Comment`,
            resource_type: "auto",
        });
        voice = { secure_url, public_id, resource_type, duration };
        failImages.push(public_id);
        //prepare data
        console.log(req.files);
    }
    const comment = new Database_1.Comment({
        post: postId,
        userComment: req.authUser?._id,
        text,
        attachment,
        voice,
        parentComment: id || undefined
    });
    //save to db
    const commentCreated = await comment.save();
    if (!commentCreated) {
        return next(new AppError_1.AppError(messages_1.messages.comment.failToCreate, 500));
    }
    //save response
    return res
        .status(200)
        .json({
        message: messages_1.messages.comment.createdSuccessfully,
        success: true,
        CommentData: commentCreated,
    });
};
exports.createComment = createComment;
//---------------------------------------------------Get Comment--------------------------------------------------------------
const getComment = async (req, res, next) => {
    //get data from req
    const { postId, id } = req.params;
    //get comment
    const commentData = await Database_1.Comment.find({ post: postId, parentComment: id }).populate([
        { path: "userComment", select: "firstName lastName attachment.secure_url" },
        { path: "likes", select: "firstName lastName attachment.secure_url" },
        {
            path: "post",
            populate: [
                {
                    path: "publisher",
                    select: "firstName lastName attachment.secure_url",
                },
                { path: "likes", select: "firstName lastName attachment.secure_url" },
            ],
        },
    ]);
    //total comment
    const TotalComment = await Database_1.Comment.countDocuments({ post: postId });
    //send response
    return res.status(200).json({ success: true, TotalComment, commentData });
};
exports.getComment = getComment;
