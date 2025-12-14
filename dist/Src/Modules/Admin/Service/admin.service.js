"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const Database_1 = require("../../../../Database");
const getData = async (req, res, next) => {
    const result = await Promise.all([Database_1.User.find(), Database_1.Post.find()]);
    //send response 
    return res.status(200).json({ success: true, Data: result });
};
exports.getData = getData;
