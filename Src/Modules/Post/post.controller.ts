import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { isValid } from "../../Middleware/validation";
import { cloudUpload, fileValidation } from "../../Utils/Cloud-Upload";
import { roles } from "../../Utils/constant/enum";
import commentRouter from "../Comment/comment.controller";
import * as postService from "./Services/post.service";
import * as postValidation from "./post.validation";
const postRouter = Router();
// send params to child
postRouter.use("/:postId/comment", commentRouter);
//create post
postRouter.post(
  "/create-post",
  isAuthentication,
  isAuthorization([roles.USER]),
  cloudUpload([
    ...fileValidation.image,
    ...fileValidation.videos,
    ...fileValidation.documents,
    ...fileValidation.audios,
  ]).array("attachment", 5),
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
postRouter.get(
  "/",
  isAuthentication,
  isAuthorization([roles.USER]),
  asyncHandler(postService.getPosts)
);
//get specific post
postRouter.get(
  "/:id",
  isAuthentication,
  isAuthorization([roles.USER]),
  isValid(postValidation.getSpecificPost),
  asyncHandler(postService.getSpecificPost)
);
//delete posts
postRouter.delete("/:id",isAuthentication , isAuthorization([roles.USER]),isValid(postValidation.deletePost),asyncHandler(postService.deletePost))
export default postRouter;
