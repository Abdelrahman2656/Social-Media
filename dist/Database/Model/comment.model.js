"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const cloud_1 = __importDefault(require("../../Src/Utils/Cloud-Upload/cloud"));
//schema 
const commentSchema = new mongoose_1.Schema({
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userComment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: function () {
            return !this.attachment;
        }
    },
    attachment: {
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        },
        resource_type: {
            type: String,
        }
    },
    voice: {
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        },
        resource_type: {
            type: String,
        },
        duration: Number
    },
    likes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        }],
    parentComment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment"
    }
}, {
    timestamps: true
});
//mongoose hook to delete replies 
commentSchema.post("deleteOne", { document: true, query: false }, async function (doc, next) {
    //check replies related comment
    const CommentModel = this.constructor;
    const replies = await CommentModel.find({ parentComment: doc._id });
    if (replies.length > 0) {
        for (const reply of replies) {
            //delete attachment from cloud 
            if (reply.attachment?.public_id) {
                await cloud_1.default.uploader.destroy(reply.attachment.public_id);
            }
            //delete reply from db 
            await reply.deleteOne();
        }
    }
    next();
});
//model 
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
