"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = exports.getData = void 0;
const Database_1 = require("../../../../Database");
const AppError_1 = require("../../../Utils/AppError/AppError");
const enum_1 = require("../../../Utils/constant/enum");
const messages_1 = require("../../../Utils/constant/messages");
//---------------------------------------------------Get Data--------------------------------------------------------------
const getData = async (req, res, next) => {
    const [userData, postData] = await Promise.all([Database_1.User.find(), Database_1.Post.find()]);
    //send response
    return res.status(200).json({
        success: true,
        Data: {
            userData,
            postData,
        },
    });
};
exports.getData = getData;
//---------------------------------------------------Update roles--------------------------------------------------------------
const updateRole = async (req, res, next) => {
    //get data from req
    const { userId } = req.params;
    const { role } = req.body;
    const updatedById = req.authUser?._id;
    //Check user role
    const data = req.authUser?.role === enum_1.roles.SUPERADMIN
        ? { roles: { $nin: enum_1.roles.SUPERADMIN } }
        : { roles: { $nin: [enum_1.roles.ADMIN, enum_1.roles.SUPERADMIN] } };
    // update role
    const user = await Database_1.User.findOneAndUpdate({ _id: userId, isDeleted: false, ...data }, { role, updatedBy: updatedById }, { new: true });
    //if is not one of this is
    if (!user) {
        return next(new AppError_1.AppError(messages_1.messages.user.notAllowed, 401));
    }
    //send response 
    return res.status(200).json({ message: messages_1.messages.user.updateSuccessfully, success: true, user });
};
exports.updateRole = updateRole;
