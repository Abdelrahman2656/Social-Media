"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
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
//model 
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
