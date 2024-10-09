import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import { config } from "../config/config";


interface JwtPayload {
    _id: string;
    iat: number;
    exp: number;
  }
export interface AuthRequest extends Request {
    userId: string;
  }

export const authenticate = (req:Request,res:Response, next:NextFunction) => {

   const token=req.header("Authorization");
   if(!token){
    return next(createHttpError(401,"Authorization token is required"));
   }

   const parsedToken=token.split(' ')[1];
   try {
     // Cast decoded token to JwtPayload
    const decoded=jwt.verify(parsedToken,config.secret as string) as JwtPayload;

     // Attach userId to the request object
    const _req=req as AuthRequest;
   _req.userId=decoded._id as string;
    next();
   } catch (error) {
    console.error("Invalid token:", error);
    return next(createHttpError(401, "Invalid token"));
   }
}