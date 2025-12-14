import cors from 'cors';
import dotenv from "dotenv";
import { Application } from "express";
import helmet from 'helmet';
import path from "path";
import { dbconnection } from "../Database/dbconnection";
import { globalErrorHandling } from "./Middleware/asyncHandler";
import { adminRouter, commentRouter, postRouter, userRouter } from "./Modules";
import { limiter } from './Utils/RateLimiter/rateLimiter';

export const bootstrap = (
  app: Application,
  express: typeof import("express")
) => {
  //-----------------------------------------------parse------------------------------------------------------------
  app.use(express.json());
  //rate-limiter 
  app.use(limiter)
//helmet
app.use(helmet())
  dotenv.config({ path: path.resolve("./.env") })
  app.use(cors({
   origin: '*', 
 }));
 //-----------------------------------------------DataBase Connection------------------------------------------------------------
 dbconnection();

 //----------------------------------------------- Use the auth router------------------------------------------------------------

 app.use('/api/v1',userRouter);
 app.use('/api/v1/post',postRouter)
 app.use("/api/v1/comment",commentRouter)
 app.use('/admin',adminRouter)

  //-----------------------------------------------globalErrorHandling------------------------------------------------------------
  app.use(globalErrorHandling as any);
};
