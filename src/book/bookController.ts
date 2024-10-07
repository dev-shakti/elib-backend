import Book from "./bookModel";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const createBook = async(req: Request, res: Response, next: NextFunction) => {
    res.json({msg:"Book created successfully"})
}

export {createBook}