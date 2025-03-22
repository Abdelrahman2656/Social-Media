"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCloudImage = void 0;
const cloudinary_1 = require("cloudinary");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
//dotenv
dotenv_1.default.config({ path: path_1.default.resolve("./.env") });
//cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
});
exports.default = cloudinary_1.v2;
//fail image upload
const deleteCloudImage = async (public_id) => {
    await cloudinary_1.v2.uploader.destroy(public_id);
};
exports.deleteCloudImage = deleteCloudImage;
