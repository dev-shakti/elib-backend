import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import Book from "./bookModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, description } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Check if files exist
  if (!files.coverImage || !files.file) {
    return next(
      createHttpError(400, "Cover image and book file are required.")
    );
  }

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const coverImageFileName = files.coverImage[0].filename;
  const coverImageFilePath = path.resolve(
    __dirname,
    "../public/data/uploads",
    coverImageFileName
  );

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../public/data/uploads",
    bookFileName
  );

  try {
    //upload cover image to cloudinary
    const uploadResult = await cloudinary.uploader.upload(coverImageFilePath, {
      filename_override: coverImageFileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    console.log("Upload result for cover image:", uploadResult);

    //upload pdfs to cloudinary
    const uploadBookFileResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "auto",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    console.log("Upload result for book file:", uploadBookFileResult);

    // Create book in the database

    const newBook = await Book.create({
      title,
      genre,
      description,
      author: "5f47ac26c282f407f047b6a0",
      coverImage: uploadResult.secure_url,
      file: uploadBookFileResult.secure_url,
    });
    res.status(201).json({ id: newBook._id });

    //remove local files from public/data/uploads
    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "An unexpected error occurred."));
  }
};

export { createBook };
