import { Router } from "express";

import * as adminService from "./Service/admin.service";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { asyncHandler } from "../../Middleware/asyncHandler";
const adminRouter = Router();

//get data
adminRouter.get(
  "/data",
  isAuthentication,
  isAuthorization([roles.ADMIN]),asyncHandler(adminService.getData)
);
export default adminRouter;
