"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
//schema
const postSchema = new mongoose_1.Schema({
    content: {
        type: String
    },
    attachment: [{
            secure_url: {
                type: String, required: true
            },
            public_id: {
                type: String, required: true
            },
            resource_type: {
                type: String
            },
        }],
    publisher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        // required:true,
    },
    likes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    //archive
    isDeleted: {
        type: Boolean,
        default: false
    }
});
//model
exports.Post = (0, mongoose_1.model)('Post', postSchema);
