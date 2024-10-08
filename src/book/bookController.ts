import Book from "./bookModel";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
//const filePath = files.coverImage[0].path;
console.log('File path before Cloudinary upload:', filePath);
 // Check if file exists before upload
 if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return next(createHttpError(404, 'File not found'));
  }
  try { 
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-covers",
        format: coverImageMimeType,
      });
      console.log("upload results",uploadResult)
      fs.unlinkSync(filePath);

    res.json({ msg: "Book created successfully", uploadResult });
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    return next(createHttpError(500, "Cloudinary upload failed"));
  }
  
};

export { createBook };
