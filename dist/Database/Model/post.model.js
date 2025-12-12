"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/ar");
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const mongoose_1 = require("mongoose");
//time
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.locale("ar");
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
//comment virtual
postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post"
});
//time 
postSchema.virtual("timeAgo").get(function () {
    return (0, dayjs_1.default)(this.createdAt).fromNow();
});
postSchema.virtual("createdAtFormatted").get(function () {
    return (0, dayjs_1.default)(this.createdAt).format("dddd DD MMMM YYYY • h:mm A");
});
//model
exports.Post = (0, mongoose_1.model)('Post', postSchema);
