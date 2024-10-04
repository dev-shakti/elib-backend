import { HttpError } from "http-errors";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";

const globalErrorHandlers = (
    err: HttpError, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // Handle the error and send a response
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message:err.message,
        errorStack:config.env=== "development" ? err.stack : ""
     })
    
}

export default globalErrorHandlers