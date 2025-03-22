"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidation = void 0;
exports.fileValidation = {
    image: [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/svg+xml",
    ],
    videos: [
        "video/mp4",
        "video/mpeg",
        "video/ogg",
        "video/quicktime",
        "video/webm",
        "video/x-ms-wmv",
        "video/x-msvideo",
    ],
    audios: ["audio/midi", "audio/mpeg", "audio/webm", "audio/ogg", "audio/wav"],
    documents: ["application/javascript", "application/json", "application/pdf"],
};
