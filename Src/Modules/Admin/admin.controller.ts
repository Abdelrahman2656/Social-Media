import { Router } from "express";
import * as adminValidation from "./admin.validation";
import * as adminService from "./Service/admin.service";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { isValid } from "../../Middleware/validation";
const adminRouter = Router();

//get data
adminRouter.get(
  "/data",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(adminService.getData)
);
//update role
adminRouter.patch(
  "/dashboard/updateRole/:userId",
  isAuthentication,
  isAuthorization([roles.ADMIN, roles.SUPERADMIN]),
  isValid(adminValidation.updateRole),
  asyncHandler(adminService.updateRole)
);
export default adminRouter;
