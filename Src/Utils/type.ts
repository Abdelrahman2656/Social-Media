import { NextFunction, Request, Response } from "express";

import { UserDocument } from "../../Database";
export interface AppRequest extends Request {
    authUser?: UserDocument;
    failImages?: string[];
    failImage?:{ secure_url: string; public_id: string }
  }
export type AppResponse = Response

export type AppNext = NextFunction

