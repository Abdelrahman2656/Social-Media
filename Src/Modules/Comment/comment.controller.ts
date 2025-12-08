import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { isValid } from "../../Middleware/validation";
import { cloudUpload, fileValidation } from "../../Utils/Cloud-Upload";
import { roles } from "../../Utils/constant/enum";
import * as commentValidation from "./comment.validation";
import * as commentService from "./Service/comment.service";
const commentRouter = Router({ mergeParams: true });
//create comment and reply
commentRouter.post(
  "/:id?",
  isAuthentication,
  isAuthorization([roles.USER, roles.ADMIN]),
  cloudUpload([
    ...fileValidation.image,
    ...fileValidation.videos,
    ...fileValidation.audios,
    ...fileValidation.documents,
  ]).fields([
    { name: "attachment", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  isValid(commentValidation.createComment),
  asyncHandler(commentService.createComment)
);
//get comment
//post/postId/comment
commentRouter.get(
  "/",
  isAuthentication,
  isAuthorization([roles.USER, roles.ADMIN]),
  isValid(commentValidation.getComment),
  asyncHandler(commentService.getComment)
);
export default commentRouter;
