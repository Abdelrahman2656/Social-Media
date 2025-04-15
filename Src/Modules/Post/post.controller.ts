import { Router } from "express";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { cloudUpload } from "../../Utils/Cloud-Upload";
import { isValid } from "../../Middleware/validation";
import * as postService from "./post.service";
import * as postValidation from "./post.validation";
import { asyncHandler } from "../../Middleware/asyncHandler";
const postRouter = Router();
//create post
postRouter.post(
  "/create-post",
  isAuthentication,
  isAuthorization([roles.USER]),
  cloudUpload({}).array("attachment", 5),
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
export default postRouter;
