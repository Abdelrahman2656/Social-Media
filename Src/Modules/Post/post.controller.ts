import { Router } from "express";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { cloudUpload, fileValidation } from "../../Utils/Cloud-Upload";
import { isValid } from "../../Middleware/validation";
import * as postService from "./Services/post.service";
import * as postValidation from "./post.validation";
import { asyncHandler } from "../../Middleware/asyncHandler";
const postRouter = Router();
//create post
postRouter.post(
  "/create-post",
  isAuthentication,
  isAuthorization([roles.USER]),
  cloudUpload([...fileValidation.image , ...fileValidation.videos ,...fileValidation.documents ,  ...fileValidation.audios,]).array("attachment", 5),
  isValid(postValidation.createPostVal),
  asyncHandler(postService.createPost)
);
//like or unlike
postRouter.patch(
  "/like-or-unlike/:userId",
  isAuthentication,
  isAuthorization([roles.USER]),
  isValid(postValidation.likeOrUnlike),
  asyncHandler(postService.likeOrUnlike)
);
// get posts
postRouter.get("/",isAuthentication,isAuthorization([roles.USER]),asyncHandler(postService.getPosts))
export default postRouter;
