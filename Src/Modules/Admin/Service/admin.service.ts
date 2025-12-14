import { Post, User } from "../../../../Database";
import { AppError } from "../../../Utils/AppError/AppError";
import { roles } from "../../../Utils/constant/enum";
import { messages } from "../../../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../../../Utils/type";
//---------------------------------------------------Get Data--------------------------------------------------------------
export const getData = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  const [userData, postData] = await Promise.all([User.find(), Post.find()]);
  //send response
  return res.status(200).json({
    success: true,
    Data: {
      userData,
      postData,
    },
  });
};
//---------------------------------------------------Update roles--------------------------------------------------------------
export const updateRole = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { userId } = req.params;
  const { role } = req.body;
  const updatedById = req.authUser?._id;
  //Check user role
  const data =
    req.authUser?.role === roles.SUPERADMIN
      ? { roles: { $nin: [roles.SUPERADMIN] } }
      : { roles: { $nin: [roles.ADMIN, roles.SUPERADMIN] } };

  // update role
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false, ...data },
    { role, updatedBy: updatedById },
    { new: true }
  );
  //if is not one of this is
  if(!user){
    return next(new AppError(messages.user.notAllowed , 401))
  }
  //send response 
  return res.status(200).json({message:messages.user.updateSuccessfully ,success:true , user})
};
