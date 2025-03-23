import { User } from "../../Database";
import { AppError } from "../Utils/AppError/AppError";
import { messages } from "../Utils/constant/messages";

import { AppNext, AppRequest, AppResponse } from "../Utils/type";

import { AuthenticatedRequest } from "./authorization";
import { verifyToken } from "../Utils/Token/token";

export const isAuthentication = async (
  req: AuthenticatedRequest,
  res: AppResponse,
  next: AppNext
) => {
  try {
    // Get data from request headers
    const { authorization } = req.headers;

    if (!authorization?.startsWith("abdelrahman")) {
      return next(new Error("Invalid bearer token"));
    }

    const token = authorization.split(" ")[1]; // ["hambozo", "token"]

    // Check token
    const result = await verifyToken({
      token,
      secretKey: process.env.SECRET_TOKEN,
    }); // ⬅️ Await the promise

    // 🔹 Verify Token (Ensure `verifyToken` doesn't return null)

    if (!result || typeof result !== "object" || !("_id" in result)) {
      return next(new AppError("Invalid or expired token", 401));
    }

    // Check if user exists
    const authUser = await User.findOne({ _id: result._id, isConfirmed: true });
    if (!authUser) {
      return next(new AppError(messages.user.notFound, 404));
    }

    console.log("✅ Authenticated User:", authUser);
    // Store authenticated user in request object
    req.authUser = authUser;
    next();
  } catch (error) {
    return next(new Error("Authentication failed"));
  }
};
