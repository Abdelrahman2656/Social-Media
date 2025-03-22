"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.postRouter = void 0;
const post_controller_1 = __importDefault(require("./Post/post.controller"));
exports.postRouter = post_controller_1.default;
const user_controller_1 = __importDefault(require("./User/user.controller"));
exports.userRouter = user_controller_1.default;
