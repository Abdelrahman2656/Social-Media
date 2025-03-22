import { NextFunction, Request, Response } from "express";

import { UserDocument } from "../../Database";
export interface AppRequest extends Request {
    authUser?: UserDocument;
    failImages?: string[];
  }
export type AppResponse = Response

export type AppNext = NextFunction

